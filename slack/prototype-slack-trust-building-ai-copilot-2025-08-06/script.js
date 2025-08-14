// Trust-Building AI Copilot Interactive Prototype
class TrustBuildingAICopilot {
    constructor() {
        this.currentView = 'transparency';
        this.trustScore = 87;
        this.accuracyScore = 94;
        this.isDemo = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeAnimations();
        this.startRealTimeUpdates();
    }
    
    bindEvents() {
        // Navigation events
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.switchView(view);
            });
        });
        
        // Validation button events
        document.querySelectorAll('.validation-buttons .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleValidationAction(e.target.closest('.btn'));
            });
        });
        
        // Premium indicator click
        document.querySelector('.premium-indicator').addEventListener('click', () => {
            this.showPremiumModal();
        });
        
        // Modal events
        document.querySelector('.modal-close')?.addEventListener('click', () => {
            this.hidePremiumModal();
        });
        
        // Close modal on background click
        document.getElementById('premium-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hidePremiumModal();
            }
        });
        
        // Confidence indicators hover
        document.querySelectorAll('.confidence-indicator').forEach(indicator => {
            indicator.addEventListener('mouseenter', (e) => {
                this.showConfidenceTooltip(e.target);
            });
            
            indicator.addEventListener('mouseleave', (e) => {
                this.hideConfidenceTooltip(e.target);
            });
        });
        
        // Demo mode toggle (for sales presentations)
        this.createDemoControls();
    }
    
    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
        
        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');
        
        this.currentView = viewName;
        
        // Trigger view-specific animations
        this.animateViewTransition(viewName);
    }
    
    handleValidationAction(button) {
        const action = button.classList.contains('btn-approve') ? 'approve' :
                      button.classList.contains('btn-edit') ? 'edit' : 'reject';
        
        // Visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Update trust metrics based on action
        if (action === 'approve') {
            this.updateTrustScore(2);
            this.showFeedbackMessage('✅ AI suggestion approved! Trust score increased.', 'success');
        } else if (action === 'edit') {
            this.updateTrustScore(1);
            this.showFeedbackMessage('✏️ Feedback recorded! AI will learn from your edits.', 'info');
        } else {
            this.updateTrustScore(-1);
            this.showFeedbackMessage('❌ Suggestion rejected. AI will improve based on your feedback.', 'warning');
        }
    }
    
    updateTrustScore(change) {
        this.trustScore = Math.max(0, Math.min(100, this.trustScore + change));
        this.accuracyScore = Math.max(0, Math.min(100, this.accuracyScore + (change * 0.5)));
        
        // Animate score changes
        this.animateScoreUpdate('.trust-score', this.trustScore);
        this.animateScoreUpdate('.accuracy-score', this.accuracyScore);
    }
    
    animateScoreUpdate(selector, newValue) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        element.style.transform = 'scale(1.1)';
        element.style.color = '#22c55e';
        
        setTimeout(() => {
            element.textContent = `${newValue}%`;
            element.style.transform = '';
            element.style.color = '';
        }, 200);
    }
    
    showFeedbackMessage(message, type) {
        // Create feedback message
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.innerHTML = `
            <div class="feedback-content">
                <span>${message}</span>
                <button class="feedback-close">&times;</button>
            </div>
        `;
        
        // Style the feedback message
        feedback.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            background: ${type === 'success' ? '#22c55e' : type === 'info' ? '#3b82f6' : '#f59e0b'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        document.body.appendChild(feedback);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            feedback.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
        
        // Manual close
        feedback.querySelector('.feedback-close').addEventListener('click', () => {
            feedback.remove();
        });
    }
    
    showPremiumModal() {
        const modal = document.getElementById('premium-modal');
        modal.style.display = 'block';
        modal.style.animation = 'fadeIn 0.3s ease-out';
    }
    
    hidePremiumModal() {
        const modal = document.getElementById('premium-modal');
        modal.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    animateViewTransition(viewName) {
        const view = document.getElementById(`${viewName}-view`);
        view.classList.add('fade-in');
        
        setTimeout(() => {
            view.classList.remove('fade-in');
        }, 300);
        
        // View-specific animations
        if (viewName === 'confidence') {
            this.animateConfidenceBars();
        } else if (viewName === 'cultural') {
            this.animateCulturalAlignment();
        } else if (viewName === 'progression') {
            this.animateProgressionTimeline();
        }
    }
    
    animateConfidenceBars() {
        document.querySelectorAll('.confidence-fill').forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 0.8s ease-out';
                bar.style.width = width;
            }, index * 200);
        });
    }
    
    animateCulturalAlignment() {
        const attributes = document.querySelectorAll('.attribute');
        attributes.forEach((attr, index) => {
            attr.style.opacity = '0';
            attr.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                attr.style.transition = 'all 0.5s ease-out';
                attr.style.opacity = '1';
                attr.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    animateProgressionTimeline() {
        const phases = document.querySelectorAll('.journey-phase');
        phases.forEach((phase, index) => {
            if (phase.classList.contains('completed') || phase.classList.contains('current')) {
                phase.style.opacity = '0';
                phase.style.transform = 'translateX(-30px)';
                
                setTimeout(() => {
                    phase.style.transition = 'all 0.6s ease-out';
                    phase.style.opacity = '1';
                    phase.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }
    
    startRealTimeUpdates() {
        // Simulate real-time updates for demo purposes
        setInterval(() => {
            if (this.isDemo) {
                this.simulateAIActivity();
            }
        }, 5000);
    }
    
    simulateAIActivity() {
        // Add new suggestion to the confidence view
        const suggestions = [
            { type: 'Email Response', confidence: Math.floor(Math.random() * 30) + 70 },
            { type: 'Calendar Optimization', confidence: Math.floor(Math.random() * 40) + 60 },
            { type: 'Document Summary', confidence: Math.floor(Math.random() * 20) + 80 },
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        this.addSuggestionToList(randomSuggestion);
    }
    
    addSuggestionToList(suggestion) {
        const suggestionsList = document.querySelector('.suggestions-list');
        if (!suggestionsList) return;
        
        const confidenceClass = suggestion.confidence >= 80 ? 'high-confidence' :
                               suggestion.confidence >= 60 ? 'medium-confidence' : 'low-confidence';
        
        const confidenceLabel = suggestion.confidence >= 80 ? 'High' :
                               suggestion.confidence >= 60 ? 'Medium' : 'Low';
        
        const actionText = suggestion.confidence >= 80 ? 'Auto-approved' :
                          suggestion.confidence >= 60 ? 'Human review requested' : 'Manual approval required';
        
        const newItem = document.createElement('div');
        newItem.className = `suggestion-item ${confidenceClass}`;
        newItem.innerHTML = `
            <div class="suggestion-info">
                <div class="suggestion-type">${suggestion.type}</div>
                <div class="suggestion-time">Just now</div>
            </div>
            <div class="confidence-indicator">
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${suggestion.confidence}%"></div>
                </div>
                <span class="confidence-value">${suggestion.confidence}%</span>
                <span class="confidence-label ${confidenceLabel.toLowerCase()}">${confidenceLabel}</span>
            </div>
            <div class="suggestion-action">
                <span class="${confidenceClass.replace('-confidence', '-approved').replace('high', 'auto').replace('medium', 'human-review').replace('low', 'manual-approval')}">${actionText}</span>
            </div>
        `;
        
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateY(-10px)';
        
        suggestionsList.insertBefore(newItem, suggestionsList.firstChild);
        
        // Animate in
        setTimeout(() => {
            newItem.style.transition = 'all 0.3s ease-out';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove oldest items if too many
        const items = suggestionsList.querySelectorAll('.suggestion-item');
        if (items.length > 5) {
            items[items.length - 1].remove();
        }
    }
    
    createDemoControls() {
        // Create demo control panel for sales presentations
        const demoControls = document.createElement('div');
        demoControls.id = 'demo-controls';
        demoControls.innerHTML = `
            <div class="demo-panel">
                <h3>Demo Controls</h3>
                <button id="toggle-demo" class="demo-btn">Enable Demo Mode</button>
                <button id="simulate-approval" class="demo-btn">Simulate Approval</button>
                <button id="simulate-rejection" class="demo-btn">Simulate Rejection</button>
                <button id="show-roi" class="demo-btn">Show ROI Impact</button>
                <div class="demo-stats">
                    <div>Demo Mode: <span id="demo-status">Off</span></div>
                    <div>Trust Score: <span id="demo-trust">${this.trustScore}%</span></div>
                </div>
            </div>
        `;
        
        demoControls.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            background: #1a1a1a;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: none;
        `;
        
        document.body.appendChild(demoControls);
        
        // Show/hide demo controls with keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                const panel = document.getElementById('demo-controls');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });
        
        // Bind demo control events
        document.getElementById('toggle-demo').addEventListener('click', () => {
            this.isDemo = !this.isDemo;
            document.getElementById('demo-status').textContent = this.isDemo ? 'On' : 'Off';
            document.getElementById('toggle-demo').textContent = this.isDemo ? 'Disable Demo Mode' : 'Enable Demo Mode';
        });
        
        document.getElementById('simulate-approval').addEventListener('click', () => {
            this.handleValidationAction(document.querySelector('.btn-approve'));
        });
        
        document.getElementById('simulate-rejection').addEventListener('click', () => {
            this.handleValidationAction(document.querySelector('.btn-reject'));
        });
        
        document.getElementById('show-roi').addEventListener('click', () => {
            this.showPremiumModal();
        });
    }
    
    initializeAnimations() {
        // Add CSS animations for feedback messages
        const animationStyles = document.createElement('style');
        animationStyles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .feedback-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .feedback-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0.8;
            }
            
            .feedback-close:hover {
                opacity: 1;
            }
            
            .demo-panel h3 {
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }
            
            .demo-btn {
                background: #4a154b;
                color: white;
                border: none;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.7rem;
                cursor: pointer;
                margin: 0.25rem 0.25rem 0.25rem 0;
            }
            
            .demo-btn:hover {
                background: #611f69;
            }
            
            .demo-stats {
                margin-top: 0.5rem;
                padding-top: 0.5rem;
                border-top: 1px solid #333;
            }
            
            .demo-stats div {
                margin-bottom: 0.25rem;
            }
        `;
        
        document.head.appendChild(animationStyles);
    }
    
    // Sales presentation helpers
    highlightPremiumValue() {
        const premiumCard = document.querySelector('.roi-card.premium');
        if (premiumCard) {
            premiumCard.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                premiumCard.style.animation = '';
            }, 1000);
        }
    }
    
    showTrustJourney() {
        this.switchView('progression');
        setTimeout(() => {
            this.animateProgressionTimeline();
        }, 500);
    }
    
    demonstrateTransparency() {
        this.switchView('transparency');
        
        // Highlight reasoning pathway
        const reasoningSteps = document.querySelectorAll('.reasoning-step');
        reasoningSteps.forEach((step, index) => {
            setTimeout(() => {
                step.style.transform = 'scale(1.02)';
                step.style.boxShadow = '0 4px 15px rgba(74, 21, 75, 0.2)';
                
                setTimeout(() => {
                    step.style.transform = '';
                    step.style.boxShadow = '';
                }, 1000);
            }, index * 500);
        });
    }
}

// Initialize the prototype when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.trustBuildingAI = new TrustBuildingAICopilot();
    
    // Add helpful console message for demo
    console.log(`
    🚀 Trust-Building AI Copilot Demo Loaded!
    
    Demo Controls:
    • Press Ctrl+Shift+D to show/hide demo controls
    • Click validation buttons to see trust scores change
    • Use navigation to explore different views
    • Click premium indicator for value proposition
    
    Sales Demo Functions:
    • trustBuildingAI.demonstrateTransparency()
    • trustBuildingAI.showTrustJourney()
    • trustBuildingAI.highlightPremiumValue()
    `);
});

// Export for global access
window.TrustBuildingAICopilot = TrustBuildingAICopilot;