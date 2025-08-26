// SAFE UI FIX - Architecture Guardian Compliant
// Phase 1: Agent Selection Visibility Only (No SDK violations)

// Feature Flag Check
function checkFeatureFlag() {
    // In production, check actual feature flag system
    return localStorage.getItem('eden_design_critic_ui_enhanced') === 'true' || 
           new URLSearchParams(window.location.search).get('ui_enhanced') === 'true';
}

// Pure CSS/UI Enhancement (No API calls)
function enhanceAgentSelectionVisibility() {
    if (!checkFeatureFlag()) {
        console.log('Enhanced UI disabled by feature flag');
        return;
    }
    
    console.log('Applying safe UI enhancements...');
    
    // Find existing agent selector
    const agentCards = document.getElementById('agentCards');
    if (!agentCards) {
        console.warn('Agent cards container not found');
        return;
    }
    
    // Add prominent heading if missing
    if (!document.querySelector('.agent-selector-heading')) {
        const heading = document.createElement('div');
        heading.className = 'agent-selector-heading';
        heading.innerHTML = 'SELECT AGENT TO CURATE';
        heading.style.cssText = `
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #9CA3AF;
            margin-bottom: 16px;
            padding: 16px;
            border-bottom: 1px solid #1F2937;
            background: rgba(31, 41, 55, 0.5);
        `;
        
        // Insert before agent cards
        agentCards.parentNode.insertBefore(heading, agentCards);
    }
    
    // Enhance existing buttons (don't replace functionality)
    const existingButtons = agentCards.querySelectorAll('button');
    existingButtons.forEach(button => {
        // Add enhanced styling without breaking existing functionality
        button.style.cssText += `
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-weight: bold !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            padding: 12px 24px !important;
            margin: 4px !important;
            border: 2px solid #1F2937 !important;
            background: transparent !important;
            color: #9CA3AF !important;
            transition: all 150ms ease !important;
            cursor: pointer !important;
        `;
        
        // Enhanced hover without breaking existing handlers
        const originalMouseEnter = button.onmouseenter;
        const originalMouseLeave = button.onmouseleave;
        
        button.onmouseenter = function(e) {
            this.style.background = '#fff !important';
            this.style.color = '#000 !important';
            this.style.borderColor = '#fff !important';
            if (originalMouseEnter) originalMouseEnter.call(this, e);
        };
        
        button.onmouseleave = function(e) {
            if (!this.classList.contains('selected')) {
                this.style.background = 'transparent !important';
                this.style.color = '#9CA3AF !important';
                this.style.borderColor = '#1F2937 !important';
            }
            if (originalMouseLeave) originalMouseLeave.call(this, e);
        };
    });
    
    // Make container more prominent
    agentCards.style.cssText += `
        padding: 24px !important;
        border: 1px solid #1F2937 !important;
        background: rgba(0, 0, 0, 0.8) !important;
        margin: 16px 0 !important;
    `;
    
    console.log('Safe UI enhancements applied successfully');
}

// Apply HELVETICA typography (CSS-only, safe)
function applyHelveticaTypography() {
    if (!checkFeatureFlag()) return;
    
    const style = document.createElement('style');
    style.id = 'helvetica-typography-enhancement';
    style.textContent = `
        /* Safe typography enhancements */
        .enhanced-ui h1, .enhanced-ui h2, .enhanced-ui h3 {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-weight: bold !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
        }
        
        .enhanced-ui button {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
        }
        
        /* Make agent selection area more prominent */
        .enhanced-ui #agentCards {
            box-shadow: 0 0 0 1px #1F2937 !important;
        }
    `;
    
    document.head.appendChild(style);
    document.body.classList.add('enhanced-ui');
}

// Rollback function
function rollback() {
    console.log('Rolling back UI enhancements...');
    
    // Remove heading
    const heading = document.querySelector('.agent-selector-heading');
    if (heading) heading.remove();
    
    // Remove style override
    const style = document.getElementById('helvetica-typography-enhancement');
    if (style) style.remove();
    
    // Remove class
    document.body.classList.remove('enhanced-ui');
    
    // Reset agent cards styling
    const agentCards = document.getElementById('agentCards');
    if (agentCards) {
        agentCards.style.cssText = '';
        
        const buttons = agentCards.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.cssText = '';
            button.onmouseenter = null;
            button.onmouseleave = null;
        });
    }
    
    console.log('UI enhancements rolled back');
}

// Safe initialization
function initialize() {
    // Only run if feature flag enabled
    if (checkFeatureFlag()) {
        console.log('Eden Design Critic: Enhanced UI enabled');
        enhanceAgentSelectionVisibility();
        applyHelveticaTypography();
    } else {
        console.log('Eden Design Critic: Enhanced UI disabled by feature flag');
    }
}

// Export for manual control
window.designCriticSafeUI = {
    initialize,
    rollback,
    checkFeatureFlag,
    enhanceAgentSelectionVisibility,
    applyHelveticaTypography
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', initialize);

// Command to enable: localStorage.setItem('eden_design_critic_ui_enhanced', 'true')
// Command to disable: localStorage.removeItem('eden_design_critic_ui_enhanced')
// Or use URL: ?ui_enhanced=true