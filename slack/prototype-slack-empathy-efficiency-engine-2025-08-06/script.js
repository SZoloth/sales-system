// Empathy-Efficiency Workflow Engine - Interactive Prototype
// Built for Slack Cultural Bridge Platform demonstration

class EmpathyEfficiencyEngine {
    constructor() {
        this.currentMode = 'efficiency';
        this.teamMetrics = {
            productivity: 91,
            relationship: 65,
            safety: 73,
            balance: 78
        };
        this.isHighPressure = true;
        this.aiSuggestionsVisible = false;
        
        this.initializeEventListeners();
        this.startMetricsSimulation();
        this.updateInterface();
    }

    initializeEventListeners() {
        // Mode toggle functionality
        const modeOptions = document.querySelectorAll('.mode-option');
        modeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const mode = option.dataset.mode;
                this.switchMode(mode);
            });
        });

        // Demo controls
        document.getElementById('simulateStress').addEventListener('click', () => {
            this.simulateHighPressure();
        });
        
        document.getElementById('simulateSuccess').addEventListener('click', () => {
            this.simulateTeamSuccess();
        });
        
        document.getElementById('showAISuggestions').addEventListener('click', () => {
            this.toggleAISuggestions();
        });
        
        document.getElementById('resetDemo').addEventListener('click', () => {
            this.resetDemo();
        });

        document.getElementById('demoToggle').addEventListener('click', () => {
            this.toggleDemoControls();
        });

        // Message input and suggestions
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Smart suggestions
        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const message = chip.dataset.message;
                messageInput.value = message;
                this.sendMessage();
            });
        });

        // Context card actions
        document.getElementById('scheduleCheckinBtn').addEventListener('click', () => {
            this.scheduleCheckin();
        });

        // Close context cards
        document.querySelectorAll('.card-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.context-card').style.display = 'none';
            });
        });

        // Channel switching
        document.querySelectorAll('.channel').forEach(channel => {
            channel.addEventListener('click', () => {
                this.switchChannel(channel.dataset.channel);
            });
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update toggle UI
        document.querySelectorAll('.mode-option').forEach(option => {
            option.classList.toggle('active', option.dataset.mode === mode);
        });
        
        const modeToggle = document.getElementById('modeToggle');
        modeToggle.setAttribute('data-active', mode);
        
        // Update interface based on mode
        this.updateInterface();
        this.updateContextCards();
        this.updateSmartSuggestions();
        
        // Simulate metrics change
        if (mode === 'empathy') {
            this.teamMetrics.relationship = Math.min(95, this.teamMetrics.relationship + 15);
            this.teamMetrics.safety = Math.min(95, this.teamMetrics.safety + 10);
            this.teamMetrics.productivity = Math.max(70, this.teamMetrics.productivity - 5);
        } else {
            this.teamMetrics.productivity = Math.min(95, this.teamMetrics.productivity + 10);
            this.teamMetrics.relationship = Math.max(50, this.teamMetrics.relationship - 8);
        }
        
        this.updateMetrics();
        this.addModeChangeMessage();
    }

    updateInterface() {
        const body = document.body;
        body.className = `${this.currentMode}-mode`;
        
        // Update balance indicator
        this.updateBalanceIndicator();
    }

    updateBalanceIndicator() {
        const balanceScore = document.getElementById('balanceScore');
        const empathyBar = document.querySelector('.empathy-bar');
        const efficiencyBar = document.querySelector('.efficiency-bar');
        
        const balance = Math.round((this.teamMetrics.relationship + this.teamMetrics.productivity) / 2);
        balanceScore.textContent = `${balance}%`;
        
        empathyBar.style.width = `${this.teamMetrics.relationship}%`;
        efficiencyBar.style.width = `${this.teamMetrics.productivity}%`;
    }

    updateContextCards() {
        const efficiencyCard = document.getElementById('efficiencyCard');
        const empathyCard = document.getElementById('empathyCard');
        
        if (this.currentMode === 'efficiency' && this.isHighPressure) {
            efficiencyCard.style.display = 'block';
            empathyCard.style.display = 'none';
        } else if (this.currentMode === 'empathy') {
            efficiencyCard.style.display = 'none';
            empathyCard.style.display = 'block';
        } else {
            efficiencyCard.style.display = 'none';
            empathyCard.style.display = 'none';
        }
    }

    updateSmartSuggestions() {
        const suggestions = document.getElementById('smartSuggestions');
        const chips = suggestions.querySelectorAll('.suggestion-chip');
        
        // Update suggestions based on current mode
        if (this.currentMode === 'empathy') {
            chips[0].textContent = 'Thank you all! 💚';
            chips[0].dataset.message = 'Thank you all for the amazing work! 💚';
            
            chips[1].textContent = 'Share appreciation';
            chips[1].dataset.message = 'I really appreciate how supportive everyone has been during this sprint.';
            
            chips[2].textContent = 'Team coffee break?';
            chips[2].dataset.message = 'Anyone up for a virtual coffee break at 3pm? ☕';
        } else {
            chips[0].textContent = 'Great work Maria! 🎉';
            chips[0].dataset.message = 'Great work Maria! 🎉';
            
            chips[1].textContent = 'Offer Support';
            chips[1].dataset.message = 'James, need any help with those camera angles?';
            
            chips[2].textContent = 'Schedule Sync';
            chips[2].dataset.message = 'Team standup at 2pm to sync on final push';
        }
    }

    updateMetrics() {
        // Update team health dashboard
        document.getElementById('productivityScore').textContent = `${this.teamMetrics.productivity}%`;
        document.getElementById('relationshipScore').textContent = `${this.teamMetrics.relationship}%`;
        document.getElementById('safetyScore').textContent = `${this.teamMetrics.safety}%`;
        
        // Update progress bars
        document.querySelector('.metric-fill.productivity').style.width = `${this.teamMetrics.productivity}%`;
        document.querySelector('.metric-fill.relationship').style.width = `${this.teamMetrics.relationship}%`;
        document.querySelector('.metric-fill.safety').style.width = `${this.teamMetrics.safety}%`;
        
        // Update balance indicator
        this.updateBalanceIndicator();
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add message to chat
        this.addMessageToChat('You', message, 'YU');
        
        // Clear input
        input.value = '';
        
        // Simulate team response based on message content and mode
        setTimeout(() => {
            this.simulateTeamResponse(message);
        }, 1500);
        
        // Update metrics based on message sentiment
        this.updateMetricsBasedOnMessage(message);
    }

    addMessageToChat(author, text, avatar) {
        const messagesContainer = document.getElementById('messagesContainer');
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        
        const currentTime = new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${author}</span>
                    <span class="message-time">${currentTime}</span>
                </div>
                <div class="message-text">${text}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addModeChangeMessage() {
        const modeText = this.currentMode === 'empathy' ? 'Empathy-First Mode' : 'Efficiency Mode';
        const icon = this.currentMode === 'empathy' ? '💝' : '⚡';
        
        this.addMessageToChat('Workflow AI', `${icon} Team switched to ${modeText}. Interface and suggestions have been optimized accordingly.`, 'AI');
    }

    simulateTeamResponse(userMessage) {
        const responses = {
            empathy: [
                { author: 'Sarah Martinez', text: 'Thanks for checking in! Really appreciate the support.', avatar: 'SM' },
                { author: 'James Chen', text: 'That means a lot. Feeling much better about the camera work now!', avatar: 'JC' },
                { author: 'Maria Rodriguez', text: 'Love working with this team! 💚', avatar: 'MR' }
            ],
            efficiency: [
                { author: 'Sarah Martinez', text: 'Perfect! I\'ll coordinate with the review team.', avatar: 'SM' },
                { author: 'James Chen', text: 'Sounds good. I\'ll have those sequences ready by 2pm.', avatar: 'JC' },
                { author: 'Maria Rodriguez', text: 'Already uploaded to the shared drive! 📁', avatar: 'MR' }
            ]
        };
        
        const modeResponses = responses[this.currentMode];
        const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];
        
        this.addMessageToChat(randomResponse.author, randomResponse.text, randomResponse.avatar);
    }

    updateMetricsBasedOnMessage(message) {
        const empathyKeywords = ['thank', 'appreciate', 'support', 'help', 'feel', 'care', 'love'];
        const efficiencyKeywords = ['deadline', 'complete', 'finish', 'ready', 'schedule', 'sync', 'status'];
        
        const messageWords = message.toLowerCase().split(' ');
        const hasEmpathy = empathyKeywords.some(keyword => messageWords.includes(keyword));
        const hasEfficiency = efficiencyKeywords.some(keyword => messageWords.includes(keyword));
        
        if (hasEmpathy) {
            this.teamMetrics.relationship = Math.min(100, this.teamMetrics.relationship + 2);
            this.teamMetrics.safety = Math.min(100, this.teamMetrics.safety + 1);
        }
        
        if (hasEfficiency) {
            this.teamMetrics.productivity = Math.min(100, this.teamMetrics.productivity + 1);
        }
        
        this.updateMetrics();
    }

    scheduleCheckin() {
        const card = document.getElementById('efficiencyCard');
        card.style.display = 'none';
        
        this.addMessageToChat('Workflow AI', '📅 Team check-in scheduled for 3:30 PM today. Invites sent to all team members.', 'AI');
        
        // Improve relationship metrics
        this.teamMetrics.relationship = Math.min(100, this.teamMetrics.relationship + 10);
        this.teamMetrics.safety = Math.min(100, this.teamMetrics.safety + 5);
        this.updateMetrics();
    }

    toggleAISuggestions() {
        const aiSuggestion = document.getElementById('aiSuggestion1');
        this.aiSuggestionsVisible = !this.aiSuggestionsVisible;
        
        if (this.aiSuggestionsVisible) {
            aiSuggestion.style.display = 'flex';
            document.getElementById('showAISuggestions').textContent = 'Hide AI Suggestions';
        } else {
            aiSuggestion.style.display = 'none';
            document.getElementById('showAISuggestions').textContent = 'Show AI Suggestions';
        }
    }

    simulateHighPressure() {
        this.isHighPressure = true;
        this.teamMetrics.productivity = 95;
        this.teamMetrics.relationship = 55;
        this.teamMetrics.safety = 62;
        
        // Add high pressure channel notification
        const channel = document.querySelector('[data-channel="final-layout-crunch"]');
        channel.classList.add('high-pressure');
        
        this.updateMetrics();
        this.updateContextCards();
        
        this.addMessageToChat('System', '🔥 High-pressure period detected. Team metrics show increased productivity but declining relationship health.', 'AI');
    }

    simulateTeamSuccess() {
        this.isHighPressure = false;
        this.teamMetrics.productivity = 88;
        this.teamMetrics.relationship = 92;
        this.teamMetrics.safety = 89;
        
        // Remove high pressure indicators
        const channel = document.querySelector('[data-channel="final-layout-crunch"]');
        channel.classList.remove('high-pressure');
        
        this.updateMetrics();
        this.updateContextCards();
        
        this.addMessageToChat('System', '🎉 Milestone achieved! Team balance is excellent - great time for celebration and relationship building.', 'AI');
    }

    resetDemo() {
        // Reset to initial state
        this.currentMode = 'efficiency';
        this.isHighPressure = true;
        this.aiSuggestionsVisible = false;
        this.teamMetrics = {
            productivity: 91,
            relationship: 65,
            safety: 73,
            balance: 78
        };
        
        // Reset UI
        this.switchMode('efficiency');
        this.updateMetrics();
        document.getElementById('aiSuggestion1').style.display = 'none';
        document.getElementById('showAISuggestions').textContent = 'Show AI Suggestions';
        document.getElementById('efficiencyCard').style.display = 'block';
        document.getElementById('empathyCard').style.display = 'none';
        
        this.addMessageToChat('System', '🔄 Demo reset to initial state.', 'AI');
    }

    switchChannel(channelName) {
        // Update active channel
        document.querySelectorAll('.channel').forEach(ch => {
            ch.classList.toggle('active', ch.dataset.channel === channelName);
        });
        
        // Update channel title
        const title = document.querySelector('.channel-title');
        title.textContent = `# ${channelName}`;
        
        // Simulate different team dynamics per channel
        if (channelName === 'final-layout-crunch') {
            this.simulateHighPressure();
        } else if (channelName === 'general') {
            this.teamMetrics.relationship = 78;
            this.updateMetrics();
        }
    }

    toggleDemoControls() {
        const controls = document.getElementById('demoControls');
        const toggle = document.getElementById('demoToggle');
        const actions = document.querySelector('.demo-actions');
        
        if (actions.style.display === 'none') {
            actions.style.display = 'flex';
            toggle.textContent = 'Hide Controls';
        } else {
            actions.style.display = 'none';
            toggle.textContent = 'Show Controls';
        }
    }

    startMetricsSimulation() {
        // Subtle metrics fluctuation to show live data
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance to update
                const fluctuation = Math.random() * 4 - 2; // -2 to +2
                
                if (this.currentMode === 'efficiency') {
                    this.teamMetrics.productivity = Math.max(70, Math.min(100, this.teamMetrics.productivity + fluctuation));
                } else {
                    this.teamMetrics.relationship = Math.max(50, Math.min(100, this.teamMetrics.relationship + fluctuation));
                }
                
                this.updateMetrics();
            }
        }, 5000); // Update every 5 seconds
    }
}

// Initialize the prototype when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.empathyEngine = new EmpathyEfficiencyEngine();
    
    // Add welcome message
    setTimeout(() => {
        window.empathyEngine.addMessageToChat(
            'Workflow AI', 
            '👋 Welcome to the Empathy-Efficiency Workflow Engine demo! Toggle between modes to see how AI adapts to optimize both productivity and team relationships.',
            'AI'
        );
    }, 1000);
});

// Export for potential external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmpathyEfficiencyEngine;
}