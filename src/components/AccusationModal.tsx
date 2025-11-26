import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { suspects, solution } from '@/data/caseData';

interface AccusationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccusationModal = ({ isOpen, onClose }: AccusationModalProps) => {
  const [selectedKiller, setSelectedKiller] = useState('');
  const [weapon, setWeapon] = useState('');
  const [explanation, setExplanation] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const isFormValid = selectedKiller && weapon && explanation;

  const checkAnswer = () => {
    const isKillerCorrect = selectedKiller === solution.killer;
    const isWeaponCorrect = solution.weapon.some((w) =>
      weapon.toLowerCase().includes(w.toLowerCase())
    );
    const isExplanationValid =
      explanation.toLowerCase().includes('لعق') ||
      explanation.toLowerCase().includes('الإصبع') ||
      explanation.toLowerCase().includes('ورق') ||
      explanation.toLowerCase().includes('صفح');

    if (isKillerCorrect && isWeaponCorrect && isExplanationValid) {
      setResult('correct');
    } else {
      setResult('wrong');
    }
  };

  const handleReset = () => {
    setSelectedKiller('');
    setWeapon('');
    setExplanation('');
    setResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border-4 border-lock-gold rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
        >
          {result === null ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-cairo font-bold text-primary">
                  نموذج الاتهام الرسمي - القضية 409-B
                </h2>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="killer" className="font-cairo font-bold text-lg">
                    اسم القاتل *
                  </Label>
                  <Select value={selectedKiller} onValueChange={setSelectedKiller}>
                    <SelectTrigger id="killer" className="font-amiri">
                      <SelectValue placeholder="اختر المشتبه به" />
                    </SelectTrigger>
                    <SelectContent>
                      {suspects.map((suspect) => (
                        <SelectItem
                          key={suspect.id}
                          value={suspect.id}
                          className="font-amiri"
                        >
                          {suspect.name} - {suspect.relation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weapon" className="font-cairo font-bold text-lg">
                    أداة الجريمة *
                  </Label>
                  <Input
                    id="weapon"
                    value={weapon}
                    onChange={(e) => setWeapon(e.target.value)}
                    placeholder="اكتب ما تعتقد أنه أداة القتل"
                    className="font-amiri"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation" className="font-cairo font-bold text-lg">
                    الدليل السلوكي وطريقة التسميم *
                  </Label>
                  <Textarea
                    id="explanation"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="اشرح كيف تم تنفيذ الجريمة بالتفصيل"
                    className="font-amiri min-h-[150px]"
                  />
                </div>

                <Button
                  onClick={checkAnswer}
                  disabled={!isFormValid}
                  className="w-full font-cairo font-bold text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  تقديم الاتهام
                </Button>
              </div>
            </>
          ) : result === 'correct' ? (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
              >
                <CheckCircle className="w-24 h-24 mx-auto text-green-500" />
              </motion.div>

              <h2 className="text-3xl font-cairo font-bold text-green-500">
                أحسنت! لقد حللت القضية!
              </h2>

              <div className="text-right space-y-4 bg-muted/50 p-6 rounded-lg">
                <h3 className="text-xl font-cairo font-bold text-primary">
                  الحل الكامل للقضية:
                </h3>
                <p className="text-base font-amiri leading-relaxed whitespace-pre-line">
                  {solution.explanation}
                </p>
              </div>

              <Button
                onClick={handleClose}
                className="font-cairo font-bold text-lg px-8 py-6"
              >
                إغلاق
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
              >
                <XCircle className="w-24 h-24 mx-auto text-destructive" />
              </motion.div>

              <h2 className="text-3xl font-cairo font-bold text-destructive">
                استنتاجك خاطئ!
              </h2>

              <p className="text-lg font-amiri">
                راجع الأدلة بعناية وحاول مرة أخرى. انتبه للتفاصيل الصغيرة في المشاهد.
              </p>

              <div className="flex gap-4">
                <Button
                  onClick={handleReset}
                  className="flex-1 font-cairo font-bold"
                  variant="outline"
                >
                  حاول مرة أخرى
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 font-cairo font-bold"
                >
                  العودة للوحة
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccusationModal;
