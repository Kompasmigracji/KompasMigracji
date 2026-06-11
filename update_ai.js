const fs = require('fs');
const path = require('path');

const file = 'C:\\Users\\user\\Documents\\GitHub\\KompasMigracji\\components\\KompasAI.tsx';
let content = fs.readFileSync(file, 'utf8');

const updatedUseEffect = `  useEffect(() => {
    const t = setTimeout(() => setShown(true), 5000 + Math.random() * 5000);

    const handleOpenChat = (e) => {
      setShown(true);
      setOpen(true);
      const serviceName = e.detail;
      if (serviceName) {
        setMessages([
          { role: 'assistant', content: \`Привіт! 👋 Я AI-асистент Kompas Migracji.\\n\\nБачу, вас цікавить послуга «\${serviceName}». Які у вас є питання або чим я можу допомогти?\` }
        ]);
      }
    };
    
    window.addEventListener('OPEN_AI_CHAT', handleOpenChat);

    return () => {
      clearTimeout(t);
      window.removeEventListener('OPEN_AI_CHAT', handleOpenChat);
    };
  }, []);`;

content = content.replace(/  useEffect\(\(\) => \{\n    const t = setTimeout\(\(\) => setShown\(true\), 5000 \+ Math\.random\(\) \* 5000\);\n    return \(\) => clearTimeout\(t\);\n  \}, \[\]\);/g, updatedUseEffect);

fs.writeFileSync(file, content);

const sgFile = 'C:\\Users\\user\\Documents\\GitHub\\KompasMigracji\\components\\ServicesGrid.tsx';
let sgContent = fs.readFileSync(sgFile, 'utf8');

// Replace ContactPicker rendering
sgContent = sgContent.replace(/\{pickerService && \(\n\s*<ContactPicker service=\{pickerService\} onClose=\{\(\) => setPickerService\(null\)\} \/>\n\s*\)\}/g, '');

// Change the onClick to dispatch event instead of setting pickerService
sgContent = sgContent.replace(/onClick=\{\(\) => setPickerService\(s\.title\)\}/g, "onClick={() => window.dispatchEvent(new CustomEvent('OPEN_AI_CHAT', { detail: s.title }))}");

fs.writeFileSync(sgFile, sgContent);
console.log('Update complete');
