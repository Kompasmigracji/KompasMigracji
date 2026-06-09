"use client";
import React, { useState } from "react";

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState([
    { id: "1", type: "trigger", title: "When Lead Created", config: {} }
  ]);

  const addNode = (type) => {
    setNodes([...nodes, { id: Date.now().toString(), type, title: `New ${type}`, config: {} }]);
  };

  const removeNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const saveWorkflow = () => {
    const json = JSON.stringify(nodes, null, 2);
    alert("Saved: \n" + json);
  };

  const loadWorkflow = () => {
    const json = prompt("Paste workflow JSON");
    if (json) {
      try {
        setNodes(JSON.parse(json));
      } catch (e) {
        alert("Invalid JSON");
      }
    }
  };

  return (
    <div className="kc-panel">
      <div className="kc-panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Visual Workflow Builder</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="kc-btn" onClick={saveWorkflow}>Save JSON</button>
          <button className="kc-btn kc-btn-outline" onClick={loadWorkflow}>Load JSON</button>
        </div>
      </div>
      
      <div className="kc-panel-body" style={{ background: 'var(--bg-elevated)', padding: '40px', minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            {/* The Node */}
            <div style={{
              width: '300px',
              padding: '16px',
              background: 'var(--bg)',
              border: `2px solid ${node.type === 'trigger' ? 'var(--color-primary)' : node.type === 'condition' ? 'var(--color-warning)' : 'var(--color-success)'}`,
              borderRadius: '8px',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '8px' }}>{node.type} Node</div>
              <input 
                type="text" 
                value={node.title} 
                onChange={(e) => {
                  const newNodes = [...nodes];
                  newNodes[index].title = e.target.value;
                  setNodes(newNodes);
                }}
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--fg)', fontSize: '16px', fontWeight: 'bold', outline: 'none' }}
              />
              {index > 0 && (
                <button 
                  onClick={() => removeNode(node.id)}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Arrow connecting to next node or add button */}
            <div style={{ width: '2px', height: '40px', background: 'var(--border)', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '-4px',
                width: '10px',
                height: '10px',
                borderBottom: '2px solid var(--border)',
                borderRight: '2px solid var(--border)',
                transform: 'rotate(45deg)'
              }} />
            </div>
          </React.Fragment>
        ))}

        {/* Add Actions */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button className="kc-btn kc-btn-outline" onClick={() => addNode('condition')}>+ Condition</button>
          <button className="kc-btn kc-btn-outline" onClick={() => addNode('action')}>+ Action</button>
        </div>

      </div>
    </div>
  );
}
