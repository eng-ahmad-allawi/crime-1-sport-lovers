import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from './ui/button';
import { Plus, FileText, ArrowRight } from 'lucide-react';
import { suspects } from '@/data/caseData';
import AccusationModal from './AccusationModal';
import { useInvestigationStore } from '@/store/investigationStore';
import { useIsMobile } from '@/hooks/use-mobile';

const suspectPositions = [
  { x: 250, y: -200 },  // أعلى
  { x: 550, y: 0 },     // يمين
  { x: 250, y: 200 },   // أسفل
  { x: -50, y: 0 },     // يسار
];

const initialNodes: Node[] = [
  {
    id: 'victim',
    type: 'default',
    position: { x: 250, y: 0 },
    data: {
      label: (
        <div className="text-center p-4">
          <div className="font-cairo font-bold text-lg text-primary">عصام الخولي</div>
          <div className="text-sm text-muted-foreground">الضحية - كاتب وجامع كتب ثري</div>
        </div>
      ),
    },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--primary))',
      borderRadius: '8px',
      width: 250,
    },
  },
  ...suspects.map((suspect, index) => ({
    id: suspect.id,
    type: 'default',
    position: suspectPositions[index],
    data: {
      label: (
        <div className="text-center p-3">
          <div className="font-cairo font-bold text-base">{suspect.name}</div>
          <div className="text-xs text-muted-foreground mb-1">{suspect.relation}</div>
          <div className="text-xs">{suspect.motive}</div>
        </div>
      ),
    },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--evidence-border))',
      borderRadius: '8px',
      width: 220,
    },
  })),
];

const initialEdges: Edge[] = suspects.map((suspect) => ({
  id: `victim-${suspect.id}`,
  source: 'victim',
  target: suspect.id,
  type: 'default',
  style: { stroke: 'hsl(var(--blood-red))', strokeWidth: 2 },
  animated: true,
}));

const InvestigationBoard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [noteCounter, setNoteCounter] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setOnBoard } = useInvestigationStore();
  const isMobile = useIsMobile();

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'default',
        style: { stroke: 'hsl(var(--blood-red))', strokeWidth: 2 },
        animated: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const addStickyNote = useCallback(() => {
    const newNode: Node = {
      id: `note-${noteCounter}`,
      type: 'default',
      position: {
        x: Math.random() * 500 + 200,
        y: Math.random() * 300 + 400,
      },
      data: {
        label: (
          <textarea
            className="w-full h-full bg-transparent border-none outline-none resize-none text-sm p-2 font-amiri"
            placeholder="اكتب ملاحظتك هنا..."
            defaultValue=""
            style={{ minHeight: '80px' }}
          />
        ),
      },
      style: {
        background: 'hsl(var(--accent))',
        border: 'none',
        borderRadius: '4px',
        width: 200,
        minHeight: 120,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNoteCounter((c) => c + 1);
  }, [noteCounter, setNodes]);

  return (
    <div className="h-screen w-full bg-background board-cursor-grab">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 400, y: 300, zoom: 0.5 }}
      >
        <Background color="hsl(var(--muted-foreground))" gap={16} />
        <Controls className="investigation-controls" />

        <Panel position={isMobile ? "bottom-center" : "top-right"} className="space-y-2">
          <Button
            onClick={() => setOnBoard(false)}
            className="font-cairo font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full"
            size={isMobile ? "default" : "lg"}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة لملفات القضية
          </Button>

          <Button
            onClick={addStickyNote}
            className="font-cairo font-bold bg-accent text-accent-foreground hover:bg-accent/90"
            size={isMobile ? "default" : "lg"}
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة ملاحظة
          </Button>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="font-cairo font-bold bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            size={isMobile ? "default" : "lg"}
          >
            <FileText className="ml-2 h-4 w-4" />
            حل القضية
          </Button>
        </Panel>

        <Panel position="top-left">
          <div className="evidence-card p-4">
            <h2 className="font-cairo font-bold text-xl text-primary mb-2">
              لوحة التحقيق
            </h2>
            <p className="text-sm text-muted-foreground font-amiri">
              اسحب البطاقات وأضف الملاحظات واربطها بالخطوط الحمراء
            </p>
          </div>
        </Panel>
      </ReactFlow>

      <AccusationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default InvestigationBoard;
