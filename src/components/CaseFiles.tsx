import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ChevronLeft } from 'lucide-react';
import { useInvestigationStore } from '@/store/investigationStore';
import { tabs, tabContent } from '@/data/caseData';
import TypewriterText from './TypewriterText';
import { Button } from './ui/button';

const CaseFiles = () => {
  const { currentTab, unlockedTabs, setCurrentTab, unlockTab, setOnBoard } = useInvestigationStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState<number[]>([]);
  const prevTabRef = useRef(currentTab);

  // تحديث قائمة التبويبات التي تمت زيارتها عند مغادرة التبويب
  useEffect(() => {
    // نضيف التبويب السابق للقائمة إذا لم يكن موجوداً
    if (prevTabRef.current !== currentTab && !visitedTabs.includes(prevTabRef.current)) {
      setVisitedTabs(prev => [...prev, prevTabRef.current]);
    }
    prevTabRef.current = currentTab;
  }, [currentTab, visitedTabs]);

  const handleNext = () => {
    if (currentTab === 4) {
      setOnBoard(true);
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      unlockTab(currentTab + 1);
      setCurrentTab(currentTab + 1);
      setIsAnimating(false);
    }, 600);
  };

  const handleTabClick = (tabId: number) => {
    if (unlockedTabs.includes(tabId)) {
      setCurrentTab(tabId);
    }
  };

  const currentContent = tabContent[currentTab as keyof typeof tabContent];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 space-y-2"
        >
          <div className="inline-block px-6 py-2 bg-primary/20 border-2 border-primary rounded-lg">
            <h1 className="text-2xl md:text-3xl font-cairo font-bold text-primary">
              ملف القضية رقم: 409-B
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-cairo font-bold text-foreground">
            السم القاتل
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const isUnlocked = unlockedTabs.includes(tab.id);
            const isActive = currentTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                disabled={!isUnlocked}
                className={`
                  relative px-4 py-3 rounded-lg font-cairo font-bold text-sm md:text-base
                  transition-all duration-300
                  ${isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : isUnlocked
                      ? 'bg-card text-card-foreground hover:bg-card/80'
                      : 'bg-muted text-muted-foreground cursor-not-allowed locked-tab'
                  }
                `}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
              >
                {!isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isAnimating && tab.id === currentTab + 1 ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Lock className="w-5 h-5 text-lock-gold" />
                  </motion.div>
                )}
                {tab.title}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="evidence-card p-6 md:p-10 space-y-8"
          >
            <h3 className="text-2xl md:text-3xl font-cairo font-bold text-primary mb-6 border-b-2 border-primary pb-2">
              {currentContent.title}
            </h3>

            {currentTab === 2 && (
              <p className="text-base md:text-lg leading-relaxed font-amiri text-foreground/80 mb-6 bg-primary/10 p-4 rounded-lg border-r-4 border-primary">
                مشاهد اجتماع الضحية مع المشتبه بهم آخر مرة قبل الاجتماع
              </p>
            )}

            {currentContent.sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h4 className="text-xl font-cairo font-bold text-foreground">
                  {section.subtitle}
                </h4>
                <TypewriterText
                  text={section.content}
                  className="text-base md:text-lg leading-relaxed whitespace-pre-line font-amiri text-foreground/90"
                  shouldAnimate={!visitedTabs.includes(currentTab)}
                />
              </div>
            ))}

            <div className="flex justify-center pt-8">
              <Button
                onClick={handleNext}
                size="lg"
                className="font-cairo font-bold text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {currentTab === 4 ? 'الانتقال للوحة التحقيق' : 'التالي'}
                <ChevronLeft className="mr-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CaseFiles;
