import React, { useState } from 'react';
import { X, FileText, Users, Shield, TrendingUp, Settings, CheckCircle, AlertTriangle, Info, ChevronDown, ChevronRight } from 'lucide-react';
import ControlManagement from './ControlManagement';
import Activities from './Activities';

interface MergedFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const MergedFlyout: React.FC<MergedFlyoutProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  const [isRiskDefinitionExpanded, setIsRiskDefinitionExpanded] = useState(false);
  const [selectedRiskDefinition, setSelectedRiskDefinition] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [riskName, setRiskName] = useState("The Audit Committee's Charter is not sufficient in scope and authority to allow the committee to fulfill its fiduciary duties.");
  const [inherentImpact, setInherentImpact] = useState('Medium');
  const [inherentLikelihood, setInherentLikelihood] = useState('High');
  const [relativeMagnitude, setRelativeMagnitude] = useState('Low');
  const [controlStrength, setControlStrength] = useState('calculated');
  const [context, setContext] = useState('');
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [isRiskSectionExpanded, setIsRiskSectionExpanded] = useState(true);
  const [formData, setFormData] = useState({
    riskName: "The Audit Committee's Charter is not sufficient in scope and authority to allow the committee to fulfill its fiduciary duties",
    riskInstanceDescription: 'Unauthorized changes are made to the legal entity structure, resulting in financial statements that include material misstatements.'
  });

  const getControlStrengthPercentage = (value: string) => {
    switch (value) {
      case 'calculated': return '68%';
      case 'assessed': return '44%';
      case 'effective': return '10%';
      case 'moderate': return '40%';
      case 'strong': return '90%';
      default: return '0%';
    }
  };

  const riskCategories = [
    {
      id: 'financial',
      name: 'Financial Risk',
      color: 'blue',
      subcategories: [
        {
          id: 'credit',
          name: 'Credit Risk',
          definitions: ['Default Risk', 'Concentration Risk', 'Settlement Risk']
        },
        {
          id: 'market',
          name: 'Market Risk',
          definitions: ['Interest Rate Risk', 'Foreign Exchange Risk', 'Equity Risk', 'Commodity Risk']
        },
        {
          id: 'liquidity',
          name: 'Liquidity Risk',
          definitions: ['Funding Liquidity Risk', 'Market Liquidity Risk']
        }
      ]
    },
    {
      id: 'operational',
      name: 'Operational Risk',
      color: 'green',
      subcategories: [
        {
          id: 'technology',
          name: 'Technology Risk',
          definitions: ['Cyber Security Risk', 'System Failure Risk', 'Data Risk']
        },
        {
          id: 'process',
          name: 'Process Risk',
          definitions: ['Human Error Risk', 'Process Failure Risk', 'Fraud Risk']
        }
      ]
    },
    {
      id: 'strategic',
      name: 'Strategic Risk',
      color: 'purple',
      subcategories: [
        {
          id: 'business',
          name: 'Business Risk',
          definitions: ['Market Competition Risk', 'Product Risk', 'Revenue Risk']
        },
        {
          id: 'reputational',
          name: 'Reputational Risk',
          definitions: ['Brand Risk', 'Customer Confidence Risk', 'Media Risk']
        }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance Risk',
      color: 'red',
      subcategories: [
        {
          id: 'regulatory',
          name: 'Regulatory Risk',
          definitions: ['Regulatory Change Risk', 'Non-Compliance Risk', 'Penalty Risk']
        },
        {
          id: 'legal',
          name: 'Legal Risk',
          definitions: ['Contract Risk', 'Litigation Risk', 'Intellectual Property Risk']
        }
      ]
    }
  ];

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(id => id !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  // Sample control data
  const sampleControls = [
    {
      id: 'ctrl-1',
      name: 'CTRL-PYMT-ELEC-29',
      type: 'existing' as const,
      libraryName: 'Internal Controls Library',
      controlInstanceId: 'CTRL-PYMT-ELEC-29',
      controlTester: 'John Smith',
      controlOwner: 'Finance Team',
      controlOperations: 'Daily Review',
      controlDefinitionCategory: 'Payment Controls',
      controlType: 'Detective',
      controlCategory: 'Credit Administration',
      description: 'Checks (bill pay) presented to the Bank for payment are reviewed and approved by authorized personnel',
      effectiveness: 100,
      implemented: 100,
      weight: 0,
      controlStrength: 85
    },
    {
      id: 'ctrl-2',
      name: 'BAF1314A-R02-C02-Management Review',
      type: 'existing' as const,
      libraryName: 'Crowe Library',
      controlInstanceId: 'BAF1314A-R02-C02',
      controlTester: 'Jane Doe',
      controlOwner: 'Compliance Team',
      controlOperations: 'Monthly Review',
      controlDefinitionCategory: 'Regulatory Compliance',
      controlType: 'Preventative',
      controlCategory: 'Crowe - Regulatory Compliance',
      description: 'Management reviews and approves electronic fund transfer activities',
      effectiveness: 100,
      implemented: 100,
      weight: 0,
      controlStrength: 90
    },
    {
      id: 'rec-1',
      name: 'Crowe Library - Communication Protocol Enhancement',
      type: 'recommended' as const,
      libraryName: 'Crowe Library - not to be used',
      controlInstanceId: 'CL-CPE-001',
      controlTester: '',
      controlOwner: '',
      controlOperations: '',
      controlDefinitionCategory: 'Communication Controls',
      controlType: 'Preventative',
      controlCategory: 'Communication Controls',
      description: 'Implement enhanced communication protocols for 314(a) requests to ensure timely and appropriate responses',
      effectiveness: 85,
      implemented: 0,
      weight: 75,
      controlStrength: 0
    },
    {
      id: 'rec-2',
      name: 'Automated Compliance Monitoring System',
      type: 'recommended' as const,
      libraryName: 'Crowe Library - not to be used',
      controlInstanceId: 'CL-ACMS-002',
      controlTester: '',
      controlOwner: '',
      controlOperations: '',
      controlDefinitionCategory: 'Monitoring Controls',
      controlType: 'Preventative',
      controlCategory: 'Monitoring Controls',
      description: 'Deploy automated system to monitor and track compliance with CFR Part 1010.520 requirements',
      effectiveness: 90,
      implemented: 0,
      weight: 80,
      controlStrength: 0
    }
  ];

  const handleEditControl = (id: string) => {
    console.log('Edit control:', id);
  };

  const handleAuditLog = (id: string) => {
    console.log('View audit log for:', id);
  };

  const handleAddRecommended = (id: string) => {
    console.log('Add recommended control:', id);
  };

  const handleMoreActions = (id: string) => {
    console.log('More actions for:', id);
  };

  const handleCreateIssue = () => {
    console.log('Create Issue clicked');
    // Add your create issue logic here
  };

  const handleCreateTask = () => {
    console.log('Create Task clicked');
    // Add your create task logic here
  };

  const tabs = [
    { id: 'details', label: 'Risk Details', icon: FileText },
    { id: 'probability', label: 'Probability Assessment', icon: Info },
    { id: 'impact', label: 'Impact Assessment', icon: AlertTriangle },
    { id: 'questionnaire', label: 'Control Environment', icon: CheckCircle },
    { id: 'controls', label: 'Controls' },
    { id: 'activities', label: 'Activities' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-6xl h-full flex flex-col shadow-xl">
        {/* Header */}
        <div className="bg-teal-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Risk Assessment</h2>
          <button onClick={onClose} className="hover:bg-teal-600 p-2 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Risk Name and Risk Instance Description - positioned between tabs and status */}
        <div className={`border-b border-gray-200 ${activeTab === 'details' ? 'bg-gray-50' : 'bg-blue-50'}`}>
          {/* Toggle Header */}
          <div 
            className="px-6 py-3 cursor-pointer hover:bg-opacity-80 transition-colors flex items-center justify-between"
            onClick={() => setIsRiskSectionExpanded(!isRiskSectionExpanded)}
          >
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-gray-700">Risk Information</h3>
              {!isRiskSectionExpanded && (
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {formData.riskName || 'No risk name'} • {formData.riskInstanceDescription ? 'Has description' : 'No description'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {isRiskSectionExpanded ? 'Collapse' : 'Expand'}
              </span>
              {isRiskSectionExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>

          {/* Collapsible Content */}
          {isRiskSectionExpanded && (
            <div className="px-6 pb-3">
              {activeTab === 'details' ? (
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Name
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                      {formData.riskName || 'No risk name specified'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Instance Description
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 min-h-[76px]">
                      {formData.riskInstanceDescription || 'No risk instance description specified'}
                    </div>
                  </div>
                 <div>
  <span className="text-sm font-semibold text-gray-700">Org Node:</span>
  <span className="text-sm text-gray-800 ml-2">Business Unit</span>
</div>
<div>
  <span className="text-sm font-semibold text-gray-700">Org Hierarchy:</span>
  <span className="text-sm text-gray-800 ml-2">Accounting and Financial Reporting &gt; Internal Reporting &gt; Management Reporting</span>
</div>
<div>
  <span className="text-sm font-semibold text-gray-700">RD BA Definition:</span>
  <span className="text-sm text-gray-800 ml-2">Process &gt; Accounting &gt; Accounts Payable</span>
</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Risk Name
                    </label>
                    <div className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-800 min-h-[38px] flex items-center">
                      {formData.riskName || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Risk Instance Description
                    </label>
                    <div className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-800 min-h-[66px] flex items-start">
                      <span className="py-1">
                        {formData.riskInstanceDescription || 'Not specified'}
                      </span>
                    </div>
                  </div>
                  <div>
  <span className="text-sm font-semibold text-gray-700">Org Node:</span>
  <span className="text-sm text-gray-800 ml-2">Business Unit</span>
</div>
<div>
  <span className="text-sm font-semibold text-gray-700">Org Hierarchy:</span>
  <span className="text-sm text-gray-800 ml-2">Accounting and Financial Reporting &gt; Internal Reporting &gt; Management Reporting</span>
</div>
<div>
  <span className="text-sm font-semibold text-gray-700">RD BA Definition:</span>
  <span className="text-sm text-gray-800 ml-2">Process &gt; Accounting &gt; Accounts Payable</span>
</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'details' ? (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Status : Currently operating between inherent & residual.</h4>
                <div className="flex justify-between items-start">
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Likelihood</div>
                      <select className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border-0 mb-2 cursor-pointer">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800">Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">3.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Impact</div>
                      <select className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border-0 mb-2 cursor-pointer">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800" selected>Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">4.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Risk Rating</div>
                      <div className="my-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border-0 mb-2 cursor-pointer">
                        <div value="high" className="bg-red-100 text-red-800" selected>High</div>
                        
                      </div>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Control Strength</div>
                      <select 
                        value={controlStrength}
                        onChange={(e) => setControlStrength(e.target.value)}
                        className="px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 mb-2 cursor-pointer"
                      >
                        <option value="calculated">Calculated (68%)</option>
                        <option value="assessed">Assessed (44%)</option>
                        <option value="effective">Effective (10%)</option>
                        <option value="moderate">Moderate (40%)</option>
                        <option value="strong">Strong (90%)</option>
                      </select>
                      <div className="text-lg font-semibold">{getControlStrengthPercentage(controlStrength)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Residual Risk</div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Effectiveness</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="85"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">85%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Implemented</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="92"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">92%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Current Risk</div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Risk Details</h3>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-b-lg p-6 space-y-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Management Comments</label>
                  <div className="border border-gray-300 rounded-lg">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center space-x-2 text-sm">
                      <button className="px-2 py-1 bg-white border border-gray-300 rounded">Source</button>
                      <button className="p-1 hover:bg-gray-200 rounded">B</button>
                      <button className="p-1 hover:bg-gray-200 rounded">I</button>
                      <button className="p-1 hover:bg-gray-200 rounded">U</button>
                    </div>
                    <textarea 
                      className="w-full p-3 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-0"
                    />
                    <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-t border-gray-300">
                      Characters: 0/5000
                    </div>
                  </div>
                </div>

                {/* Risk Owner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Risk Owner</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select Risk Owner</option>
                    <option>John Smith</option>
                    <option>Sarah Johnson</option>
                    <option>Mike Davis</option>
                  </select>
                </div>

                {/* Process Responsible */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Process Responsible</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select Process Responsible</option>
                    <option>Finance Team</option>
                    <option>Operations Team</option>
                    <option>IT Department</option>
                  </select>
                </div>

                {/* Relative Magnitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relative Magnitude</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select Magnitude</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div className="mb-6">
                  <button
                    onClick={() => setShowMoreFields(!showMoreFields)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showMoreFields ? 'See Less..' : 'See More..'}
                  </button>
                </div>

                {showMoreFields && (
                 <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Risk Definition Name</label>
                        <input 
                          type="text" 
                          defaultValue="AFRAP-R03-Accounts payable and related expenses are not properly recorded in the general ledger, resulting in financial misstatement"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Risk Events</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Select Event</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Risk Definition Description</label>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="Accounts payable and related expenses are not properly recorded in the general ledger, resulting in financial misstatement."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Select options</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
                        <input 
                          type="date" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Risk Owner</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>John Doe</option>
                          <option>Jane Smith</option>
                          <option>Mike Johnson</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Process Responsible</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Select options</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                        <input 
                          type="number" 
                          defaultValue="1"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="text-xs text-gray-500 mt-1">Please enter a number greater than zero (0)</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time per</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">Select time period</option>
                          <option value="year">Year</option>
                          <option value="month">Month</option>
                          <option value="week">Week</option>
                          <option value="day">Day</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency Legitimization</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Select options</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter outcome"
                      />
                      <p className="text-xs text-gray-500 mt-1">Please enter the outcome of the risk assessment</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Outcome Description</label>
                      <div className="border border-gray-300 rounded-lg">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center space-x-2 text-sm">
                          <button className="px-2 py-1 bg-white border border-gray-300 rounded">Source</button>
                          <button className="p-1 hover:bg-gray-200 rounded">B</button>
                          <button className="p-1 hover:bg-gray-200 rounded">I</button>
                          <button className="p-1 hover:bg-gray-200 rounded">U</button>
                          <span className="text-gray-400">|</span>
                          <button className="p-1 hover:bg-gray-200 rounded">ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</button>
                          <button className="p-1 hover:bg-gray-200 rounded">1.</button>
                        </div>
                        <textarea 
                          className="w-full p-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-0"
                        />
                        <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-t border-gray-300">
                          Characters: 0/5000
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Relative Magnitude</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Select</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Applicability</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Applicable</option>
                          <option>Not Applicable</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">High/Corporate Risk</label>
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Management Comments</label>
                      <div className="border border-gray-300 rounded-lg">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center space-x-2 text-sm">
                          <button className="px-2 py-1 bg-white border border-gray-300 rounded">Source</button>
                          <button className="p-1 hover:bg-gray-200 rounded">B</button>
                          <button className="p-1 hover:bg-gray-200 rounded">I</button>
                          <button className="p-1 hover:bg-gray-200 rounded">U</button>
                          <span className="text-gray-400">|</span>
                          <button className="p-1 hover:bg-gray-200 rounded">ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</button>
                          <button className="p-1 hover:bg-gray-200 rounded">1.</button>
                        </div>
                        <textarea 
                          className="w-full p-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-0"
                        />
                        <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-t border-gray-300">
                          Characters: 0/5000
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter context"
                      />
                    </div>

                    <div>
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg border border-gray-300"
                        onClick={() => setIsRiskDefinitionExpanded(!isRiskDefinitionExpanded)}
                      >
                        <div className="flex items-center">
                          <label className="text-sm font-medium text-gray-700 mr-2">Risk Definition</label>
                          {selectedRiskDefinition && !isRiskDefinitionExpanded && (
                            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {selectedRiskDefinition}
                            </span>
                          )}
                        </div>
                        {isRiskDefinitionExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      
                      {isRiskDefinitionExpanded && (
                        <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-white mt-2 relative">
                          {riskCategories.map((category) => (
                            <div key={category.id} className="mb-4 relative">
                              <div 
                                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded relative"
                                onClick={() => toggleCategory(category.id)}
                              >
                                {expandedCategories.includes(category.id) ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500 mr-2" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500 mr-2" />
                                )}
                                <span className={`w-2 h-2 bg-${category.color}-600 rounded-full mr-2`}></span>
                                <span className="font-medium text-gray-700">{category.name}</span>
                              </div>
                              
                              {expandedCategories.includes(category.id) && (
                                <div className="ml-6 mt-2 relative">
                                  {/* Vertical line from Level 1 to Level 2 */}
                                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300" style={{
                                    left: '-12px',
                                    height: `${category.subcategories.length * 40}px`
                                  }}></div>
                                  {category.subcategories.map((subcategory, subIndex) => (
                                    <div key={subcategory.id} className="mb-3 relative">
                                      {/* Horizontal line from vertical line to Level 2 */}
                                      <div className="absolute left-0 top-4 w-3 h-px bg-gray-300" style={{
                                        left: '-12px'
                                      }}></div>
                                      <div 
                                        className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded relative pl-4"
                                        onClick={() => toggleCategory(subcategory.id)}
                                      >
                                        {expandedCategories.includes(subcategory.id) ? (
                                          <ChevronDown className="w-3 h-3 text-gray-500 mr-2" />
                                        ) : (
                                          <ChevronRight className="w-3 h-3 text-gray-500 mr-2" />
                                        )}
                                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                        <span className="text-sm font-medium text-gray-700">{subcategory.name}</span>
                                      </div>
                                      
                                      {expandedCategories.includes(subcategory.id) && (
                                        <div className="ml-6 mt-2 relative">
                                          {/* Vertical line from Level 2 to Level 3 */}
                                          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300" style={{
                                            left: '-12px',
                                            height: `${subcategory.definitions.length * 30}px`
                                          }}></div>
                                          {subcategory.definitions.map((definition) => (
                                            <div key={definition} className="flex items-center mb-2 relative">
                                              {/* Horizontal line from vertical line to Risk Definition */}
                                              <div className="absolute left-0 top-3 w-3 h-px bg-gray-300" style={{
                                                left: '-12px'
                                              }}></div>
                                              <input
                                                type="radio"
                                                id={definition}
                                                name="riskDefinition"
                                                value={definition}
                                                checked={selectedRiskDefinition === definition}
                                                onChange={(e) => setSelectedRiskDefinition(e.target.value)}
                                                className="mr-2 ml-4"
                                              />
                                              <label htmlFor={definition} className="text-sm text-gray-700">
                                                {definition}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Fields</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Physical Justification</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Select options</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Impact Magnitude</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Select options</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Likelihood Justification</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Select options</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">All or other Risk Warning/Reporting</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Structured for high inherent risk</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Related Policies</label>
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          placeholder="Choose file..." 
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Browse</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'controls' ? (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Status : Currently operating between inherent & residual.</h4>
                <div className="flex justify-between items-start">
                  <div className="flex space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Likelihood</div>
                      <select className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-red-100 text-red-800 focus:ring-2 focus:ring-red-500">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800">Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">3.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Impact</div>
                      <select className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-yellow-100 text-yellow-800 focus:ring-2 focus:ring-yellow-500">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800" selected>Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">4.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Risk Rating</div>
                      <div className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-red-100 text-red-800 focus:ring-2 focus:ring-red-500">
                        <div value="high" className="bg-red-100 text-red-800">High</div>
                        
                      </div>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Control Strength</div>
                      <select 
                        value={controlStrength}
                        onChange={(e) => setControlStrength(e.target.value)}
                        className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-gray-100 text-gray-800 focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="calculated">Calculated (68%)</option>
                        <option value="assessed">Assessed (44%)</option>
                        <option value="effective">Effective (10%)</option>
                        <option value="moderate">Moderate (40%)</option>
                        <option value="strong">Strong (90%)</option>
                      </select>
                      <div className="text-lg font-semibold">{getControlStrengthPercentage(controlStrength)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Residual Risk</div>
                      <span className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Effectiveness</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="85"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">85%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Implemented</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="92"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">92%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Current Risk</div>
                      <span className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Control Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Simple Control Description</h3>
                <div className="border border-gray-300 rounded-lg">
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center space-x-2 text-sm">
                    <button className="px-2 py-1 bg-white border border-gray-300 rounded">Source</button>
                    <button className="p-1 hover:bg-gray-200 rounded">B</button>
                    <button className="p-1 hover:bg-gray-200 rounded">I</button>
                    <button className="p-1 hover:bg-gray-200 rounded">U</button>
                  </div>
                  <textarea 
                    className="w-full p-3 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-0"
                  />
                  <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-t border-gray-300">
                    Characters: 0/5000
                  </div>
                </div>
              </div>

              <ControlManagement
                controls={sampleControls}
                onEditControl={handleEditControl}
                onAuditLog={handleAuditLog}
                onAddRecommended={handleAddRecommended}
                onMoreActions={handleMoreActions}
              />
            </div>
          ) : null}

          {activeTab === 'questionnaire' && (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Status : Currently operating between inherent & residual.</h4>
                <div className="flex justify-between items-start">
                  <div className="flex space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Likelihood</div>
                      <select className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-red-100 text-red-800 focus:ring-2 focus:ring-red-500">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800">Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">3.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Impact</div>
                      <select className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-yellow-100 text-yellow-800 focus:ring-2 focus:ring-yellow-500">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800" selected>Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">4.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Risk Rating</div>
                      <div className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-red-100 text-red-800 focus:ring-2 focus:ring-red-500">
                        <div value="high" className="bg-red-100 text-red-800">High</div>
                      </div>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Control Strength</div>
                      <select 
                        value={controlStrength}
                        onChange={(e) => setControlStrength(e.target.value)}
                        className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-gray-100 text-gray-800 focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="calculated">Calculated (68%)</option>
                        <option value="assessed">Assessed (44%)</option>
                        <option value="effective">Effective (10%)</option>
                        <option value="moderate">Moderate (40%)</option>
                        <option value="strong">Strong (90%)</option>
                      </select>
                      <div className="text-lg font-semibold">{getControlStrengthPercentage(controlStrength)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Residual Risk</div>
                      <span className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Effectiveness</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="85"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">85%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Implemented</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="92"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">92%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Current Risk</div>
                      <span className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Compliance Program Review</h3>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-b-lg p-6 space-y-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm font-medium">1. Chief Compliance Officer / Head of Consumer Compliance</span>
                      <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="compliance_officer" value="yes" className="text-blue-600" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="compliance_officer" value="no" className="text-blue-600" />
                        <span>No</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="compliance_officer" value="partially" className="text-blue-600" />
                        <span>Partially</span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Optional Comment</label>
                      <textarea className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                      <div className="flex space-x-2">
                        <input type="text" placeholder="Browse" className="flex-1 p-2 border border-gray-300 rounded-lg" />
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Browse</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm font-medium">2. Compliance Training Program</span>
                      <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="training_program" value="yes" className="text-blue-600" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="training_program" value="no" className="text-blue-600" />
                        <span>No</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="training_program" value="partially" className="text-blue-600" />
                        <span>Partially</span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Optional Comment</label>
                      <textarea className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                      <div className="flex space-x-2">
                        <input type="text" placeholder="Browse" className="flex-1 p-2 border border-gray-300 rounded-lg" />
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Browse</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm font-medium">3. Identity Theft and Anti-Fraud Program (Reg. V)</span>
                      <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="identity_theft" value="yes" className="text-blue-600" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="identity_theft" value="no" className="text-blue-600" />
                        <span>No</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="identity_theft" value="partially" className="text-blue-600" />
                        <span>Partially</span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Optional Comment</label>
                      <textarea className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Status : Currently operating between inherent & residual.</h4>
                <div className="flex justify-between items-start">
                  <div className="flex space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Likelihood</div>
                      <select className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-red-100 text-red-800 focus:ring-2 focus:ring-red-500">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800">Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">3.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Impact</div>
                      <select className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-yellow-100 text-yellow-800 focus:ring-2 focus:ring-yellow-500">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800" selected>Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">4.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Risk Rating</div>
                      <div className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-red-100 text-red-800 focus:ring-2 focus:ring-red-500">
                        <div value="high" className="bg-red-100 text-red-800">High</div>
                      </div>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Control Strength</div>
                      <select 
                        value={controlStrength}
                        onChange={(e) => setControlStrength(e.target.value)}
                        className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-gray-100 text-gray-800 focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="calculated">Calculated (68%)</option>
                        <option value="assessed">Assessed (44%)</option>
                        <option value="effective">Effective (10%)</option>
                        <option value="moderate">Moderate (40%)</option>
                        <option value="strong">Strong (90%)</option>
                      </select>
                      <div className="text-lg font-semibold">{getControlStrengthPercentage(controlStrength)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Residual Risk</div>
                      <span className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Effectiveness</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="85"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">85%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Implemented</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="92"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">92%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Current Risk</div>
                      <span className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Impact assessment - 2019</h3>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-b-lg p-6 space-y-8">
                <div>
                  <h4 className="text-lg font-semibold mb-6">Impact assessment</h4>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium">1. Average historical financial impact:</span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm">Which level best describes the materialization of the risk related to the process under assessment?</span>
                          <Info className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="financial_impact" value="level1" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 1 - low impact: The materialization of this risk has generated a historical average financial impact &lt; USD 1,000</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="financial_impact" value="level2" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 2 - medium: The materialization of this risk has generated a historical average financial impact between USD 1,000 and USD 25,000</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="financial_impact" value="level3" className="text-blue-600 mt-1" defaultChecked />
                          <span className="text-sm">Level 3 - highly impact: The materialization of this risk has generated a historical average financial impact between USD 25,000 and USD 100,000</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="financial_impact" value="level4" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 4 - very high impact: The materialization of this risk has generated a historical average financial impact &gt; USD 100,000</span>
                        </label>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Optional Comment</label>
                        <textarea className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                        <div className="flex space-x-2">
                          <input type="text" placeholder="Browse" className="flex-1 p-2 border border-gray-300 rounded-lg" />
                          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Browse</button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium">2. Client Impact:</span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm">Which level best describes the materialization of the risk under assessment?</span>
                          <Info className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="client_impact" value="level1" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 1 - low impact: The materialization of the risk under assessment has no impact on clients OR has an impact on one client</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="client_impact" value="level2" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 2 - medium: The materialization of the risk under assessment has an impact on few clients (less than 20 clients)</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="client_impact" value="level3" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 3 - highly impact: The materialization of the risk under assessment has an impact on many clients (over 20 clients)</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="client_impact" value="level4" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 4 - very high impact: The materialization of the risk under assessment has an impact on all clients</span>
                        </label>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Optional Comment</label>
                        <textarea className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                        <div className="flex space-x-2">
                          <input type="text" placeholder="Browse" className="flex-1 p-2 border border-gray-300 rounded-lg" />
                          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Browse</button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium">3. Reputation, image impact & strategic issues:</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'probability' && (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Status : Currently operating between inherent & residual.</h4>
                <div className="flex justify-between items-start">
                  <div className="flex space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Likelihood</div>
                      <select className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-red-100 text-red-800 focus:ring-2 focus:ring-red-500">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800">Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">3.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Impact</div>
                      <select className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-yellow-100 text-yellow-800 focus:ring-2 focus:ring-yellow-500">
                        <option value="high" className="bg-red-100 text-red-800">High</option>
                        <option value="medium" className="bg-yellow-100 text-yellow-800" selected>Medium</option>
                        <option value="low" className="bg-green-100 text-green-800">Low</option>
                      </select>
                      <div className="text-lg font-semibold">4.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Inherent Risk Rating</div>
                      <div className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-red-100 text-red-800 focus:ring-2 focus:ring-red-500">
                        <div value="high" className="bg-red-100 text-red-800">High</div>
                      
                      </div>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Control Strength</div>
                      <select 
                        value={controlStrength}
                        onChange={(e) => setControlStrength(e.target.value)}
                        className="mb-2 px-2 py-1 text-xs font-medium rounded-full border-0 bg-gray-100 text-gray-800 focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="calculated">Calculated (68%)</option>
                        <option value="assessed">Assessed (44%)</option>
                        <option value="effective">Effective (10%)</option>
                        <option value="moderate">Moderate (40%)</option>
                        <option value="strong">Strong (90%)</option>
                      </select>
                      <div className="text-lg font-semibold">{getControlStrengthPercentage(controlStrength)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Residual Risk</div>
                      <span className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Effectiveness</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="85"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">85%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Implemented</div>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        defaultValue="92"
                        className="w-16 px-2 py-1 text-center text-xs font-medium border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-lg font-semibold">92%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Current Risk</div>
                      <span className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-block">
                        Low
                      </span>
                      <div className="text-lg font-semibold">12.0000</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Probability Assessment - 2019 v2</h3>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-b-lg p-6 space-y-8">
                <div>
                  <h4 className="text-lg font-semibold mb-6">Probability Assessment</h4>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium">1. Process complexity:</span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm">Which level best describes the reality of the process under assessment?</span>
                          <Info className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="process_complexity" value="level1" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 1 - low probable: The process from which the risk arises is simple.</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="process_complexity" value="level2" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 2 - probable: The process from which the risk arises is complex.</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="process_complexity" value="level3" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 3 - highly probable: The process from which the risk arises is very complex.</span>
                        </label>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Optional Comment</label>
                        <textarea className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                        <div className="flex space-x-2">
                          <input type="text" placeholder="Browse" className="flex-1 p-2 border border-gray-300 rounded-lg" />
                          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Browse</button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium">2. Process documentation:</span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm">Which level best describes the reality of the process under assessment?</span>
                          <Info className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="process_documentation" value="level1" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 1 - low probable: The documentation of the process from which the risk arises is adequate, up to date and sufficiently detailed to fully understand the operational tasks performed during the execution of the process.</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="process_documentation" value="level2" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 2 - probable: The documentation of the process from which the risk arises does not correctly reflect the reality of the process AND/OR is too high level to fully understand the operational tasks performed during the execution of the process.</span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="radio" name="process_documentation" value="level3" className="text-blue-600 mt-1" />
                          <span className="text-sm">Level 3 - highly probable: The documentation of the process from which the risk arises is not up to date or in existent.</span>
                        </label>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Optional Comment</label>
                        <textarea className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                        <div className="flex space-x-2">
                          <input type="text" placeholder="Browse" className="flex-1 p-2 border border-gray-300 rounded-lg" />
                          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Browse</button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium">3. Process automation:</span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm">Which level best describes the reality of the process under assessment?</span>
                          <Info className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' ? (
            <Activities
              onCreateIssue={handleCreateIssue}
              onCreateTask={handleCreateTask}
            />
          ) : null}
        </div>

       {/* Dynamic Footer */}
<div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
  {activeTab === 'details' && (
    <div className="flex justify-between items-center w-full">
      {/* Left: Delete Risk */}
      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
        Delete Risk
      </button>

      {/* Right: Button Group */}
      <div className="flex space-x-3">
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
          Previous
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
          Next
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Mark as Reviewed
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )}

  {(activeTab === 'impact' || activeTab === 'probability' || activeTab === 'questionnaire') && (
    <div className="flex justify-end">
      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Submit
      </button>
    </div>
  )}

  {activeTab === 'controls' && (
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        Save
      </button>
    </div>
  )}

  {activeTab === 'activities' && (
    <div></div>
  )}
</div>
      </div>
    </div>
  );
};

export default MergedFlyout;