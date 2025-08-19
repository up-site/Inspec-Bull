'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export interface BlogSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'image' | 'quote';
}

interface DynamicSectionManagerProps {
  sections: BlogSection[];
  onSectionsChange: (sections: BlogSection[]) => void;
  disabled?: boolean;
}

const DynamicSectionManager: React.FC<DynamicSectionManagerProps> = ({
  sections,
  onSectionsChange,
  disabled = false
}) => {
  const [localSections, setLocalSections] = useState<BlogSection[]>(sections);

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const generateId = () => `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addSection = () => {
    const newSection: BlogSection = {
      id: generateId(),
      title: '',
      content: '',
      order: localSections.length,
      type: 'text'
    };
    const updatedSections = [...localSections, newSection];
    setLocalSections(updatedSections);
    onSectionsChange(updatedSections);
  };

  const updateSection = (id: string, field: keyof BlogSection, value: string) => {
    const updatedSections = localSections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    );
    setLocalSections(updatedSections);
    onSectionsChange(updatedSections);
  };

  const removeSection = (id: string) => {
    if (localSections.length <= 1) return; // Keep at least one section
    const updatedSections = localSections
      .filter(section => section.id !== id)
      .map((section, index) => ({ ...section, order: index }));
    setLocalSections(updatedSections);
    onSectionsChange(updatedSections);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination || disabled) return;

    const items = Array.from(localSections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedSections = items.map((section, index) => ({
      ...section,
      order: index
    }));

    setLocalSections(reorderedSections);
    onSectionsChange(reorderedSections);
  };

  if (localSections.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="space-y-4">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">No sections added</h3>
            <p className="text-gray-500">Get started by adding your first blog section.</p>
          </div>
          <button
            onClick={addSection}
            disabled={disabled}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add First Section
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {localSections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index} isDragDisabled={disabled}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white border rounded-lg p-6 ${
                          snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                        } ${disabled ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              {...provided.dragHandleProps}
                              className={`p-2 rounded-md ${disabled ? 'cursor-not-allowed text-gray-400' : 'cursor-move text-gray-600 hover:bg-gray-100'}`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                              Section {index + 1}
                            </span>
                            <select
                              value={section.type}
                              onChange={(e) => updateSection(section.id, 'type', e.target.value)}
                              disabled={disabled}
                              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            >
                              <option value="text">Text</option>
                              <option value="quote">Quote</option>
                              <option value="image">Image</option>
                            </select>
                          </div>
                          {localSections.length > 1 && (
                            <button
                              onClick={() => removeSection(section.id)}
                              disabled={disabled}
                              className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 disabled:opacity-50"
                              title="Delete section"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Section Title *
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                              disabled={disabled}
                              placeholder="Enter section heading..."
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Section Content *
                            </label>
                            <textarea
                              value={section.content}
                              onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                              disabled={disabled}
                              rows={section.type === 'quote' ? 3 : 6}
                              placeholder={
                                section.type === 'quote' 
                                  ? "Enter quote text..." 
                                  : section.type === 'image'
                                  ? "Enter image description or caption..."
                                  : "Enter section content..."
                              }
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                              required
                            />
                            {section.type === 'quote' && (
                              <p className="mt-1 text-sm text-gray-500">
                                This content will be displayed as a highlighted quote block.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex justify-center">
        <button
          onClick={addSection}
          disabled={disabled}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Section
        </button>
      </div>
    </div>
  );
};

export default DynamicSectionManager;