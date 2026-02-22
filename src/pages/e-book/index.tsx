import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '../../components/ui/Header';
import PerformanceMonitor from '../../components/ui/PerformanceMonitor';
import Icon from '../../components/AppIcon';
import BlockRenderer from './components/BlockRenderer';
import { generateLargeBlockData } from './components/blockData';

export interface BlockItem {
  id: string;
  type: string;
  content: string;
  items: string[];
  rows: string[][];
  headers: string[];
  alt?: string;
  caption?: string;
  language?: string;
  author?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
const Ebook = () => {
  const [blocks, setBlocks] = useState<Array<BlockItem>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);

  useEffect(() => {
    const loadDataAsync = async () => {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve));
      const largeData = generateLargeBlockData();
      
      const performHeavyComputation = async () => {
        let result = 0;
        const totalIterations = 100000000;
        const chunkSize = 1000000;
        
        for (let start = 0; start < totalIterations; start += chunkSize) {
          for (let i = start; i < Math.min(start + chunkSize, totalIterations); i++) {
            result += Math.sqrt(i);
          }
          
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        return result;
      };
      
      await performHeavyComputation();
      
      setBlocks([...largeData]);
      setIsLoading(false);
    };
    
    loadDataAsync();
  }, []);

  const handleDragStart = useCallback((blockId) => {
    setDraggedBlock(blockId);
    setBlocks([...blocks]);
  }, [blocks]);

  const handleDragOver = useCallback((e, _targetId) => {
    e?.preventDefault();
    setBlocks([...blocks]);
  }, [blocks]);

  const handleDrop = useCallback((e, _targetId: string) => {
    e?.preventDefault();
    if (!draggedBlock || draggedBlock === _targetId) return;

    const draggedIndex = blocks?.findIndex(b => b?.id === draggedBlock);
    const targetIndex = blocks?.findIndex(b => b?.id === _targetId);
    
    const newBlocks = [...blocks];
    const [removed] = newBlocks?.splice(draggedIndex, 1);
    newBlocks?.splice(targetIndex, 0, removed);
    
    setBlocks([...newBlocks]);
    setDraggedBlock(null as unknown as string);
  }, [draggedBlock, blocks]);

  const handleBlockEdit = useCallback((blockId: string, newContent: string) => {
    setEditingBlock(blockId);
    setBlocks(blocks?.map(block => {
      if (block?.id === blockId) {
        return { ...block, content: newContent };
      }
      return { ...block };
    }));
  }, [blocks]);

  const _stats = useMemo(() => {
    return blocks?.reduce((acc, block) => {
      if (block?.type === 'paragraph') acc.totalWords += block?.content?.split(' ')?.length || 0;
      if (block?.type === 'heading1' || block?.type === 'heading2' || block?.type === 'heading3') acc.totalWords += block?.content?.split(' ')?.length || 0;
      if (block?.type === 'image') acc.totalImages++;
      if (block?.type === 'code') acc.totalCode++;
      return acc;
    }, { totalWords: 0, totalImages: 0, totalCode: 0 });
  }, [blocks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <PerformanceMonitor />
        <main className="pt-[76px] flex items-center justify-center h-screen">
          <div className="text-center">
            <Icon name="Loader2" className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading blocks (this will take a while)...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PerformanceMonitor />
      <main className="pt-[76px] pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Icon name="AlertTriangle" className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">E book</h1>
                <p className="text-muted-foreground mt-1">Not a book</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
          {blocks?.map((block, _index) => (
              <div
                key={block?.id}
                draggable
                onDragStart={() => handleDragStart(block?.id)}
                onDragOver={(e) => handleDragOver(e, block?.id)}
                onDrop={(e) => handleDrop(e, block?.id)}
                className={`transition-all ${
                  draggedBlock === block?.id ? 'opacity-50' : ''
                } ${
                  editingBlock === block?.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <BlockRenderer
                  block={block}
                  onEdit={(block: BlockItem) => handleBlockEdit(block?.id, block?.content)}
                  isEditing={editingBlock === block?.id}
                  key={block?.id}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ebook;