/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 */
export function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
    }

  
  
 