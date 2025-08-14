// Cultural Pulse Dashboard - Interactive JavaScript
// Version 2.1.0 - Optimized for CEO Denise Dresser's analytical leadership style

// Global Variables and Configuration
let culturalTrendChart;
let updateInterval;
let isRealTimeMode = true;

// Department Data Structure
const departmentData = {
    'Engineering': {
        empathyScore: 92,
        efficiencyScore: 85,
        culturalHealth: 88,
        status: 'healthy',
        trend: '+5%',
        insights: 'Strong collaborative culture with healthy work-life balance. Recent Salesforce integration showing positive adoption.',
        teamSize: 156,
        integrationScore: 82,
        riskLevel: 'Low',
        interventions: []
    },
    'Sales': {
        empathyScore: 68,
        efficiencyScore: 91,
        culturalHealth: 74,
        status: 'attention',
        trend: '-7%',
        insights: 'Efficiency focus creating empathy gaps. Salesforce process conflicts affecting team morale and cultural alignment.',
        teamSize: 89,
        integrationScore: 58,
        riskLevel: 'Medium',
        interventions: ['Communication workshop', 'Process alignment session']
    },
    'Marketing': {
        empathyScore: 87,
        efficiencyScore: 79,
        culturalHealth: 83,
        status: 'healthy',
        trend: '+2%',
        insights: 'Creative culture adapting well to new systems. Strong empathy scores with room for efficiency improvements.',
        teamSize: 67,
        integrationScore: 73,
        riskLevel: 'Low',
        interventions: []
    },
    'Product': {
        empathyScore: 84,
        efficiencyScore: 88,
        culturalHealth: 86,
        status: 'healthy',
        trend: '+3%',
        insights: 'Balanced approach to empathy and efficiency. Leading in cross-functional collaboration metrics.',
        teamSize: 45,
        integrationScore: 79,
        riskLevel: 'Low',
        interventions: []
    },
    'Customer Success': {
        empathyScore: 94,
        efficiencyScore: 72,
        culturalHealth: 81,
        status: 'attention',
        trend: '-3%',
        insights: 'High empathy creating efficiency bottlenecks. Salesforce workflow adoption slower due to customer-first priorities.',
        teamSize: 38,
        integrationScore: 65,
        riskLevel: 'Medium',
        interventions: ['Efficiency coaching', 'Workflow optimization']
    },
    'HR & People': {
        empathyScore: 96,
        efficiencyScore: 76,
        culturalHealth: 84,
        status: 'healthy',
        trend: '+1%',
        insights: 'Natural empathy strength supporting organizational change. Efficiency improvements needed for scaling.',
        teamSize: 22,
        integrationScore: 71,
        riskLevel: 'Low',
        interventions: []
    }
};

// AI Insights and Recommendations
const aiInsights = [
    {
        type: 'critical',
        title: 'Sales Department Cultural Tension',
        description: 'Salesforce process integration creating 23% increase in empathy-efficiency imbalance. Immediate intervention recommended to prevent turnover risk.',
        recommendation: 'Schedule Sales-Engineering collaboration workshop within 7 days.',
        impact: 'High',
        timeline: 'Immediate'
    },
    {
        type: 'warning',
        title: 'Cross-Department Communication Gaps',
        description: 'Data indicates 15% decrease in cross-functional project satisfaction. Customer Success and Sales showing coordination challenges.',
        recommendation: 'Implement weekly cross-department stand-ups with cultural health check-ins.',
        impact: 'Medium',
        timeline: '2 weeks'
    },
    {
        type: 'opportunity',
        title: 'Engineering Cultural Leadership',
        description: 'Engineering department showing strongest cultural health metrics. High potential for mentoring other departments.',
        recommendation: 'Create Engineering-led cultural ambassador program.',
        impact: 'Medium',
        timeline: '1 month'
    },
    {
        type: 'prediction',
        title: 'Q2 Cultural Health Forecast',
        description: 'Current trends predict 8% overall cultural health improvement by Q2 if Sales intervention succeeds.',
        recommendation: 'Monitor Sales metrics weekly; prepare scaling strategies for other departments.',
        impact: 'High',
        timeline: 'Ongoing'
    }
];

// Leadership Actions
const leadershipActions = {
    immediate: [
        {
            title: 'Sales Team Cultural Workshop',
            description: 'Address empathy-efficiency imbalance in Sales dept. Focus on Salesforce integration challenges.',
            priority: 'High',
            timeline: 'This week',
            owner: 'Denise Dresser + Sales VP'
        },
        {
            title: 'Customer Success Workflow Review',
            description: 'Optimize efficiency processes while maintaining empathy-first customer approach.',
            priority: 'Medium',
            timeline: '2 weeks',
            owner: 'CS Director'
        },
        {
            title: 'Cross-Department Communication Audit',
            description: 'Assess and improve information flow between Sales and Customer Success teams.',
            priority: 'Medium',
            timeline: '1 week',
            owner: 'Operations Lead'
        }
    ],
    strategic: [
        {
            title: 'Cultural Ambassador Program',
            description: 'Leverage Engineering\'s cultural strength to mentor and support other departments.',
            priority: 'High',
            timeline: '30 days',
            owner: 'HR + Engineering Director'
        },
        {
            title: 'Empathy-Efficiency Balance Framework',
            description: 'Develop systematic approach to maintain cultural balance during rapid growth and integration.',
            priority: 'High',
            timeline: '45 days',
            owner: 'Denise Dresser + Leadership Team'
        }
    ],
    communication: [
        {
            title: 'Q2 Cultural Health All-Hands',
            description: 'Template for organization-wide cultural health communication with data-driven insights.',
            type: 'Presentation Template',
            audience: 'All Company'
        },
        {
            title: 'Department Manager Cultural Brief',
            description: 'Weekly manager communication template for cultural health updates and interventions.',
            type: 'Email Template',
            audience: 'Department Managers'
        },
        {
            title: 'Salesforce Integration Success Story',
            description: 'Positive communication highlighting successful integration examples from high-performing departments.',
            type: 'Internal Blog Post',
            audience: 'All Company'
        },
        {
            title: 'Cultural Change Progress Report',
            description: 'Monthly stakeholder update template showing quantitative cultural health improvements.',
            type: 'Executive Report',
            audience: 'Board + Investors'
        }
    ]
};

// Chart Configuration and Data
const culturalTrendData = {
    labels: ['6 weeks ago', '5 weeks ago', '4 weeks ago', '3 weeks ago', '2 weeks ago', 'Last week', 'This week'],
    datasets: [
        {
            label: 'Overall Cultural Health',
            data: [82, 83, 81, 84, 85, 86, 87],
            borderColor: '#00A86B',
            backgroundColor: 'rgba(0, 168, 107, 0.1)',
            tension: 0.3,
            borderWidth: 3,
            fill: true
        },
        {
            label: 'Empathy Score',
            data: [85, 86, 84, 87, 88, 87, 88],
            borderColor: '#36C5F0',
            backgroundColor: 'rgba(54, 197, 240, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            fill: false
        },
        {
            label: 'Efficiency Score',
            data: [88, 87, 86, 85, 86, 87, 85],
            borderColor: '#4A154B',
            backgroundColor: 'rgba(74, 21, 75, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            fill: false
        },
        {
            label: 'Integration Health',
            data: [70, 72, 71, 74, 75, 75, 76],
            borderColor: '#ECB22E',
            backgroundColor: 'rgba(236, 178, 46, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            fill: false
        }
    ]
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    startRealTimeUpdates();
});

function initializeDashboard() {
    updateDateTime();
    renderDepartmentScoreCards();
    renderAIInsights();
    renderLeadershipActions();
    initializeCulturalTrendChart();
    animateKPIs();
    
    // Set last updated time
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
    
    console.log('Cultural Pulse Dashboard initialized successfully');
}

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('current-date-time').textContent = now.toLocaleDateString('en-US', options);
}

function renderDepartmentScoreCards() {
    const container = document.getElementById('department-scorecards');
    container.innerHTML = '';
    
    Object.entries(departmentData).forEach(([department, data]) => {
        const card = createDepartmentCard(department, data);
        container.appendChild(card);
    });
}

function createDepartmentCard(department, data) {
    const card = document.createElement('div');
    card.className = 'department-card fade-in';
    card.onclick = () => openDepartmentModal(department, data);
    
    const balanceScore = Math.round((data.empathyScore + data.efficiencyScore) / 2);
    const balanceWidth = Math.min(balanceScore, 100);
    
    card.innerHTML = `
        <div class="department-header">
            <div class="department-name">${department}</div>
            <div class="department-status status-${data.status}">
                ${data.status.toUpperCase()}
            </div>
        </div>
        
        <div class="balance-indicators">
            <div class="indicator">
                <div class="indicator-value empathy-score">${data.empathyScore}</div>
                <div class="indicator-label">Empathy</div>
            </div>
            <div class="indicator">
                <div class="indicator-value">${balanceScore}</div>
                <div class="indicator-label">Balance</div>
            </div>
            <div class="indicator">
                <div class="indicator-value efficiency-score">${data.efficiencyScore}</div>
                <div class="indicator-label">Efficiency</div>
            </div>
        </div>
        
        <div class="balance-meter">
            <div class="balance-fill" style="width: ${balanceWidth}%"></div>
        </div>
        
        <div class="department-insights">
            <strong>Cultural Health: ${data.culturalHealth}</strong> (${data.trend})
            <br><br>
            ${data.insights}
        </div>
    `;
    
    return card;
}

function renderAIInsights() {
    const container = document.getElementById('ai-insights');
    container.innerHTML = '';
    
    aiInsights.forEach((insight, index) => {
        const insightElement = document.createElement('div');
        insightElement.className = `insight-item ${insight.type} fade-in`;
        insightElement.style.animationDelay = `${index * 0.1}s`;
        
        insightElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <strong style="color: var(--dark-gray);">${insight.title}</strong>
                <span style="background: rgba(0,0,0,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600;">
                    ${insight.impact} Impact
                </span>
            </div>
            <div style="margin-bottom: 0.75rem; color: var(--neutral-gray);">
                ${insight.description}
            </div>
            <div style="background: rgba(255,255,255,0.8); padding: 0.75rem; border-radius: 6px; border-left: 3px solid var(--success-green);">
                <strong>Recommendation:</strong> ${insight.recommendation}
                <br>
                <small style="color: var(--neutral-gray); margin-top: 0.5rem; display: block;">
                    Timeline: ${insight.timeline}
                </small>
            </div>
        `;
        
        container.appendChild(insightElement);
    });
}

function renderLeadershipActions() {
    // Render Immediate Actions
    const immediateContainer = document.getElementById('immediate-actions');
    immediateContainer.innerHTML = '';
    
    leadershipActions.immediate.forEach(action => {
        const actionElement = createActionElement(action);
        immediateContainer.appendChild(actionElement);
    });
    
    // Render Strategic Actions
    const strategicContainer = document.getElementById('strategic-actions');
    strategicContainer.innerHTML = '';
    
    leadershipActions.strategic.forEach(action => {
        const actionElement = createActionElement(action);
        strategicContainer.appendChild(actionElement);
    });
    
    // Render Communication Templates
    const communicationContainer = document.getElementById('communication-templates');
    communicationContainer.innerHTML = '';
    
    leadershipActions.communication.forEach(template => {
        const templateElement = createCommunicationTemplate(template);
        communicationContainer.appendChild(templateElement);
    });
}

function createActionElement(action) {
    const element = document.createElement('div');
    element.className = 'action-item';
    
    const priorityColor = action.priority === 'High' ? 'var(--accent-orange)' : 
                         action.priority === 'Medium' ? 'var(--warning-yellow)' : 
                         'var(--neutral-gray)';
    
    element.innerHTML = `
        <div class="action-title">${action.title}</div>
        <div class="action-description">${action.description}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; font-size: 0.75rem;">
            <span style="color: ${priorityColor}; font-weight: 600;">
                ${action.priority} Priority
            </span>
            <span style="color: var(--neutral-gray);">
                ${action.timeline} • ${action.owner}
            </span>
        </div>
    `;
    
    element.onclick = () => showActionDetails(action);
    
    return element;
}

function createCommunicationTemplate(template) {
    const element = document.createElement('div');
    element.className = 'action-item';
    
    element.innerHTML = `
        <div class="action-title">${template.title}</div>
        <div class="action-description">${template.description}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; font-size: 0.75rem;">
            <span style="color: var(--success-green); font-weight: 600;">
                ${template.type}
            </span>
            <span style="color: var(--neutral-gray);">
                ${template.audience}
            </span>
        </div>
    `;
    
    element.onclick = () => showTemplatePreview(template);
    
    return element;
}

function initializeCulturalTrendChart() {
    const ctx = document.getElementById('cultural-trend-chart').getContext('2d');
    
    culturalTrendChart = new Chart(ctx, {
        type: 'line',
        data: culturalTrendData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 100,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function animateKPIs() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    
    kpiValues.forEach((element, index) => {
        const targetValue = parseInt(element.textContent) || element.textContent;
        
        if (typeof targetValue === 'number') {
            element.textContent = '0';
            
            setTimeout(() => {
                animateNumber(element, 0, targetValue, 1000);
            }, index * 200);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(start + (end - start) * easeOutCubic(progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function setupEventListeners() {
    // Modal close functionality
    const modal = document.getElementById('department-modal');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
}

function startRealTimeUpdates() {
    // Update date/time every minute
    setInterval(updateDateTime, 60000);
    
    // Simulate real-time data updates every 30 seconds
    if (isRealTimeMode) {
        updateInterval = setInterval(() => {
            simulateDataUpdate();
        }, 30000);
    }
}

function simulateDataUpdate() {
    // Simulate small fluctuations in metrics
    Object.keys(departmentData).forEach(dept => {
        const data = departmentData[dept];
        
        // Small random fluctuations
        data.empathyScore += Math.random() * 2 - 1;
        data.efficiencyScore += Math.random() * 2 - 1;
        data.culturalHealth += Math.random() * 2 - 1;
        data.integrationScore += Math.random() * 1.5 - 0.75;
        
        // Keep values in reasonable bounds
        data.empathyScore = Math.max(60, Math.min(100, data.empathyScore));
        data.efficiencyScore = Math.max(60, Math.min(100, data.efficiencyScore));
        data.culturalHealth = Math.max(60, Math.min(100, data.culturalHealth));
        data.integrationScore = Math.max(50, Math.min(100, data.integrationScore));
        
        // Round to whole numbers
        data.empathyScore = Math.round(data.empathyScore);
        data.efficiencyScore = Math.round(data.efficiencyScore);
        data.culturalHealth = Math.round(data.culturalHealth);
        data.integrationScore = Math.round(data.integrationScore);
    });
    
    // Update overall KPIs
    const overallHealth = Math.round(
        Object.values(departmentData)
            .reduce((sum, dept) => sum + dept.culturalHealth, 0) / 
        Object.keys(departmentData).length
    );
    
    const balanceScore = Math.round(
        Object.values(departmentData)
            .reduce((sum, dept) => sum + (dept.empathyScore + dept.efficiencyScore) / 2, 0) / 
        Object.keys(departmentData).length
    );
    
    const integrationScore = Math.round(
        Object.values(departmentData)
            .reduce((sum, dept) => sum + dept.integrationScore, 0) / 
        Object.keys(departmentData).length
    );
    
    document.getElementById('overall-health').textContent = overallHealth;
    document.getElementById('balance-score').textContent = balanceScore;
    document.getElementById('integration-score').textContent = integrationScore;
    
    // Update last updated timestamp
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
    
    // Re-render scorecards
    renderDepartmentScoreCards();
    
    console.log('Real-time data updated at', new Date().toLocaleTimeString());
}

function openDepartmentModal(department, data) {
    const modal = document.getElementById('department-modal');
    const modalBody = document.getElementById('modal-body');
    
    const riskColor = data.riskLevel === 'High' ? 'var(--accent-orange)' : 
                     data.riskLevel === 'Medium' ? 'var(--warning-yellow)' : 
                     'var(--slack-green)';
    
    modalBody.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="color: var(--dark-gray); margin: 0;">${department} Department</h2>
            <div class="department-status status-${data.status}" style="font-size: 0.9rem;">
                ${data.status.toUpperCase()}
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div style="background: var(--light-gray); padding: 1.5rem; border-radius: var(--radius-md);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--slack-green); margin-bottom: 0.5rem;">
                    ${data.empathyScore}
                </div>
                <div style="color: var(--neutral-gray); font-weight: 500;">Empathy Score</div>
            </div>
            
            <div style="background: var(--light-gray); padding: 1.5rem; border-radius: var(--radius-md);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--primary-purple); margin-bottom: 0.5rem;">
                    ${data.efficiencyScore}
                </div>
                <div style="color: var(--neutral-gray); font-weight: 500;">Efficiency Score</div>
            </div>
            
            <div style="background: var(--light-gray); padding: 1.5rem; border-radius: var(--radius-md);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--dark-gray); margin-bottom: 0.5rem;">
                    ${data.culturalHealth}
                </div>
                <div style="color: var(--neutral-gray); font-weight: 500;">Cultural Health</div>
            </div>
            
            <div style="background: var(--light-gray); padding: 1.5rem; border-radius: var(--radius-md);">
                <div style="font-size: 2rem; font-weight: bold; color: ${riskColor}; margin-bottom: 0.5rem;">
                    ${data.riskLevel}
                </div>
                <div style="color: var(--neutral-gray); font-weight: 500;">Risk Level</div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div>
                <h4 style="margin-bottom: 1rem; color: var(--dark-gray);">Team Information</h4>
                <div style="background: var(--light-gray); padding: 1rem; border-radius: var(--radius-md);">
                    <p><strong>Team Size:</strong> ${data.teamSize} members</p>
                    <p><strong>Trend:</strong> ${data.trend} from last week</p>
                    <p><strong>Integration Score:</strong> ${data.integrationScore}/100</p>
                </div>
            </div>
            
            <div>
                <h4 style="margin-bottom: 1rem; color: var(--dark-gray);">Active Interventions</h4>
                <div style="background: var(--light-gray); padding: 1rem; border-radius: var(--radius-md);">
                    ${data.interventions.length > 0 ? 
                        data.interventions.map(intervention => 
                            `<div style="margin-bottom: 0.5rem;">• ${intervention}</div>`
                        ).join('') : 
                        '<div style="color: var(--neutral-gray);">No active interventions</div>'
                    }
                </div>
            </div>
        </div>
        
        <div>
            <h4 style="margin-bottom: 1rem; color: var(--dark-gray);">Cultural Insights</h4>
            <div style="background: linear-gradient(135deg, #f8f9ff, #e8f2ff); padding: 1.5rem; border-radius: var(--radius-md); border-left: 4px solid var(--success-green);">
                ${data.insights}
            </div>
        </div>
        
        <div style="margin-top: 2rem; text-align: right;">
            <button style="background: var(--primary-purple); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); cursor: pointer; font-weight: 500;" onclick="generateDepartmentReport('${department}')">
                Generate Detailed Report
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showActionDetails(action) {
    alert(`Action Details:\n\n${action.title}\n\nDescription: ${action.description}\n\nPriority: ${action.priority}\nTimeline: ${action.timeline}\nOwner: ${action.owner}`);
}

function showTemplatePreview(template) {
    alert(`Communication Template:\n\n${template.title}\n\nDescription: ${template.description}\n\nType: ${template.type}\nAudience: ${template.audience}\n\nThis would open a template editor in the full application.`);
}

function generateDepartmentReport(department) {
    alert(`Generating comprehensive cultural health report for ${department} department...\n\nThis would generate a detailed PDF report including:\n\n• Historical trend analysis\n• Peer department comparisons\n• Specific intervention recommendations\n• ROI projections for cultural investments\n• Communication templates for team leaders\n\nReport will be available in 30 seconds.`);
}

// Utility Functions
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'healthy': return 'var(--slack-green)';
        case 'attention': return 'var(--warning-yellow)';
        case 'risk': return 'var(--accent-orange)';
        default: return 'var(--neutral-gray)';
    }
}

function exportDashboardData() {
    const exportData = {
        timestamp: new Date().toISOString(),
        overallMetrics: {
            culturalHealth: document.getElementById('overall-health').textContent,
            balanceScore: document.getElementById('balance-score').textContent,
            integrationScore: document.getElementById('integration-score').textContent
        },
        departments: departmentData,
        insights: aiInsights,
        actions: leadershipActions
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cultural-pulse-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Console Commands for Demo
console.log('%c Cultural Pulse Dashboard - Demo Commands:', 'color: #4A154B; font-weight: bold; font-size: 14px;');
console.log('%c - simulateDataUpdate(): Trigger real-time data update', 'color: #00A86B;');
console.log('%c - exportDashboardData(): Export dashboard data as JSON', 'color: #00A86B;');
console.log('%c - isRealTimeMode = false: Disable real-time updates', 'color: #00A86B;');

// Make functions available globally for demo purposes
window.simulateDataUpdate = simulateDataUpdate;
window.exportDashboardData = exportDashboardData;