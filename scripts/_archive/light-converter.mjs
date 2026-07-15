
import fs from "fs";
import path from "path";

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  
  const replacements = [
    // Backgrounds
    { from: /bg-\[#050505\]/g, to: "bg-[#f5f5f7]" },
    { from: /bg-\[#0a0a0a\]/g, to: "bg-[#f5f5f7]" },
    { from: /bg-white\/5/g, to: "bg-white/70" }, // frosted glass in light mode is usually white with opacity, wait, black/5 is better for shading, but white/70 with blur works great for Apple light mode. Lets use bg-white/60
    { from: /bg-white\/10/g, to: "bg-white/80" },
    { from: /bg-white\/20/g, to: "bg-white" },
    
    // Borders
    { from: /border-white\/5/g, to: "border-black/5" },
    { from: /border-white\/10/g, to: "border-black/10" },
    { from: /border-white\/20/g, to: "border-black/20" },
    
    // Text colors (general content)
    { from: /text-gray-200/g, to: "text-gray-800" },
    { from: /text-gray-300/g, to: "text-gray-700" },
    { from: /text-gray-400/g, to: "text-gray-600" },
    { from: /text-white/g, to: "text-gray-900" }, // This might affect buttons, we will fix buttons below
    
    // Fix buttons that got their text changed to gray-900 but need to be white
    { from: /text-gray-900(?=.*?(bg-blue-|bg-green-|bg-red-|bg-purple-|bg-indigo-|bg-amber-|bg-pink-|bg-sky-|bg-emerald-))/g, to: "text-white" }, // imperfect regex
  ];

  // A better way: Just replace text-white to text-gray-900, 
  // but let"s fix colored button backgrounds manually if needed.
  let newContent = content;
  
  newContent = newContent.replace(/bg-\[#050505\]/g, "bg-[#f5f5f7]");
  newContent = newContent.replace(/bg-\[#0a0a0a\]/g, "bg-white");
  
  // Glass backgrounds
  newContent = newContent.replace(/bg-white\/5/g, "bg-white/60");
  newContent = newContent.replace(/bg-white\/10/g, "bg-white/80");
  newContent = newContent.replace(/hover:bg-white\/5/g, "hover:bg-white/80");
  newContent = newContent.replace(/hover:bg-white\/10/g, "hover:bg-white");
  
  // Borders
  newContent = newContent.replace(/border-white\/5/g, "border-black/5");
  newContent = newContent.replace(/border-white\/10/g, "border-black/10");
  newContent = newContent.replace(/border-white\/20/g, "border-black/20");
  newContent = newContent.replace(/hover:border-white\/20/g, "hover:border-black/20");
  
  // Text colors
  newContent = newContent.replace(/text-gray-200/g, "text-gray-800");
  newContent = newContent.replace(/text-gray-300/g, "text-gray-700");
  newContent = newContent.replace(/text-gray-400/g, "text-gray-500");
  
  // Shadows
  newContent = newContent.replace(/rgba\(0,0,0,0\.5\)/g, "rgba(0,0,0,0.05)");
  newContent = newContent.replace(/rgba\(0,0,0,0\.8\)/g, "rgba(0,0,0,0.1)");
  newContent = newContent.replace(/rgba\(0,0,0,0\.3\)/g, "rgba(0,0,0,0.05)");

  // We need to be careful with text-white. Let"s replace `text-white` with `text-gray-900` 
  // EXCEPT when it is preceded or followed by a colored background in the same className string.
  // Actually, easiest way is to split by className="..." and process inside.
  newContent = newContent.replace(/className=(["`])(.*?)\1/g, (match, quote, classStr) => {
    let classes = classStr.split(" ");
    const hasColoredBg = classes.some(c => c.match(/^bg-(blue|red|green|emerald|amber|purple|pink|indigo|sky)-[456]00$/));
    const isGradientText = classes.includes("bg-clip-text");
    
    classes = classes.map(c => {
      if (c === "text-white" && !hasColoredBg && !isGradientText) return "text-gray-900";
      return c;
    });
    
    return "className=" + quote + classes.join(" ") + quote;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log("Updated:", filePath);
  }
};

const walkSync = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkSync(file));
    } else {
      if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
        results.push(file);
      }
    }
  });
  return results;
};

const files1 = walkSync("app/admin/crm");
const files2 = walkSync("components");

[...files1, ...files2].forEach(replaceInFile);
console.log("Done");

