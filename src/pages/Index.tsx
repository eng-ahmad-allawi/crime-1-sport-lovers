import { AnimatePresence } from 'framer-motion';
import { useInvestigationStore } from '@/store/investigationStore';
import LoadingScreen from '@/components/LoadingScreen';
import CaseFiles from '@/components/CaseFiles';
import InvestigationBoard from '@/components/InvestigationBoard';

const Index = () => {
  const { isLoadingComplete, isOnBoard } = useInvestigationStore();

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!isLoadingComplete ? (
          <LoadingScreen key="loading" />
        ) : isOnBoard ? (
          <InvestigationBoard key="board" />
        ) : (
          <CaseFiles key="files" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
