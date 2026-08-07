import React from "react";
import "./RichTextToolbar.css";

const RichTextToolbar = ({ fieldName, formState, setFormState, textareaId, showTemplates = false }) => {
  const handleFormat = (openTag, closeTag = "") => {
    const textarea = document.getElementById(textareaId);
    const currentValue = formState[fieldName] || "";

    if (!textarea) {
      setFormState({
        ...formState,
        [fieldName]: currentValue + `${openTag}${closeTag}`
      });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentValue.substring(start, end);
    const textToWrap = selectedText || "";
    const replacement = closeTag ? `${openTag}${textToWrap}${closeTag}` : openTag;

    const newValue = currentValue.substring(0, start) + replacement + currentValue.substring(end);
    setFormState({
      ...formState,
      [fieldName]: newValue
    });

    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + openTag.length + (selectedText ? selectedText.length : 0);
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 50);
  };

  return (
    <div className="rich-text-toolbar">
      <span className="toolbar-label">Format Helper:</span>
      <button
        type="button"
        className="toolbar-btn bold-btn"
        title="Bold selected text"
        onClick={() => handleFormat("<b>", "</b>")}
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        className="toolbar-btn italic-btn"
        title="Italicize selected text"
        onClick={() => handleFormat("<i>", "</i>")}
      >
        <em>I</em>
      </button>
      <button
        type="button"
        className="toolbar-btn heading-btn"
        title="Heading 2"
        onClick={() => handleFormat("<h2>", "</h2>")}
      >
        H2
      </button>
      <button
        type="button"
        className="toolbar-btn heading-btn"
        title="Heading 3"
        onClick={() => handleFormat("<h3>", "</h3>")}
      >
        H3
      </button>
      <button
        type="button"
        className="toolbar-btn paragraph-btn"
        title="Paragraph"
        onClick={() => handleFormat("<p>", "</p>")}
      >
        P
      </button>
      <button
        type="button"
        className="toolbar-btn list-btn"
        title="Bullet List"
        onClick={() => handleFormat("<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>")}
      >
        <i className="fas fa-list-ul"></i> List
      </button>
      <button
        type="button"
        className="toolbar-btn break-btn"
        title="Line Break"
        onClick={() => handleFormat("<br/>")}
      >
        Line Break
      </button>

      {showTemplates && (
        <>
          <div className="toolbar-separator"></div>
          <span className="toolbar-label">Templates:</span>

          <button
            type="button"
            className="toolbar-btn template-btn"
            title="Insert What We Do Section"
            onClick={() => handleFormat("<h2>What We Do</h2>\n<p>Enter details about what we do for this program...</p>\n")}
          >
            + What We Do
          </button>

          <button
            type="button"
            className="toolbar-btn template-btn"
            title="Insert Our Approach Grid"
            onClick={() => handleFormat(
              `<h2>Our Approach</h2>\n<div class="approach-grid">\n  <div class="approach-card">\n    <div class="approach-icon-box">\n      <i class="fas fa-crosshairs approach-icon"></i>\n    </div>\n    <div class="approach-info">\n      <span class="approach-step">01</span>\n      <span class="approach-title">Career Counselling &amp; Mobilisation</span>\n    </div>\n  </div>\n  <div class="approach-card">\n    <div class="approach-icon-box">\n      <i class="fas fa-chart-line approach-icon"></i>\n    </div>\n    <div class="approach-info">\n      <span class="approach-step">02</span>\n      <span class="approach-title">Employability &amp; Workplace Readiness</span>\n    </div>\n  </div>\n  <div class="approach-card">\n    <div class="approach-icon-box">\n      <i class="fas fa-hand-holding-heart approach-icon"></i>\n    </div>\n    <div class="approach-info">\n      <span class="approach-step">03</span>\n      <span class="approach-title">Industry Exposure &amp; Placement Support</span>\n    </div>\n  </div>\n  <div class="approach-card">\n    <div class="approach-icon-box">\n      <i class="fas fa-lightbulb approach-icon"></i>\n    </div>\n    <div class="approach-info">\n      <span class="approach-step">04</span>\n      <span class="approach-title">Entrepreneurship &amp; SHG Development</span>\n    </div>\n  </div>\n  <div class="approach-card">\n    <div class="approach-icon-box">\n      <i class="fas fa-stopwatch approach-icon"></i>\n    </div>\n    <div class="approach-info">\n      <span class="approach-step">05</span>\n      <span class="approach-title">Industry-Aligned Skill Training</span>\n    </div>\n  </div>\n</div>\n`
            )}
          >
            + Our Approach
          </button>

          <button
            type="button"
            className="toolbar-btn template-btn"
            title="Insert Program Impact Stats Grid"
            onClick={() => handleFormat(
              `<h2>Program Impact</h2>\n<div class="impact-stats-grid">\n  <div class="impact-stat-card">\n    <div class="impact-number">14,044</div>\n    <div class="impact-label">Candidates Trained</div>\n  </div>\n  <div class="impact-stat-card">\n    <div class="impact-number">1,663</div>\n    <div class="impact-label">Youth Trained</div>\n  </div>\n  <div class="impact-stat-card">\n    <div class="impact-number">705</div>\n    <div class="impact-label">Candidates Placed</div>\n  </div>\n  <div class="impact-stat-card">\n    <div class="impact-number">80%</div>\n    <div class="impact-label">Placement Ratio</div>\n  </div>\n  <div class="impact-stat-card">\n    <div class="impact-number">132</div>\n    <div class="impact-label">SHG Enterprises Supported</div>\n  </div>\n  <div class="impact-stat-card">\n    <div class="impact-number">13k -17k</div>\n    <div class="impact-label">Average In-hand Salary</div>\n  </div>\n</div>\n`
            )}
          >
            + Program Impact
          </button>
        </>
      )}
    </div>
  );
};

export default RichTextToolbar;
