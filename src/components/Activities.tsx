import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Plus, Calendar, User, Activity } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface ActivityItem {
  id: string;
  name: string;
  type: 'Issue' | 'Task';
  dateCreated: string;
  dateUpdated: string;
  assignee: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Closed';
}

interface ActivitiesProps {
  onCreateIssue?: () => void;
  onCreateTask?: () => void;
}

// Custom cell renderer for type badges
const TypeCellRenderer = (params: any) => {
  const isIssue = params.value === 'Issue';
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      isIssue 
        ? 'bg-red-100 text-red-800' 
        : 'bg-blue-100 text-blue-800'
    }`}>
      {params.value}
    </span>
  );
};

// Custom cell renderer for status badges
const StatusCellRenderer = (params: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(params.value)}`}>
      {params.value}
    </span>
  );
};

// Custom cell renderer for assignee
const AssigneeCellRenderer = (params: any) => {
  if (!params.value) {
    return <span className="text-gray-400">Unassigned</span>;
  }
  
  return (
    <div className="flex items-center">
      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
        {params.value.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm">{params.value}</span>
    </div>
  );
};

const Activities: React.FC<ActivitiesProps> = ({
  onCreateIssue,
  onCreateTask
}) => {
  const [gridApi, setGridApi] = useState<any>(null);
  const [controlStrength, setControlStrength] = useState('calculated');

  const getControlStrengthPercentage = (strength: string) => {
    switch (strength) {
      case 'calculated':
        return '68%';
      case 'assessed':
        return '44%';
      case 'effective':
        return '10%';
      case 'moderate':
        return '40%';
      case 'strong':
        return '90%';
      default:
        return '68%';
    }
  };

  // Sample data - replace with actual data from your application
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      name: 'Review security controls implementation',
      type: 'Task',
      dateCreated: '2024-01-15',
      dateUpdated: '2024-01-16',
      assignee: 'John Smith',
      status: 'In Progress'
    },
    {
      id: '2',
      name: 'Critical vulnerability found in authentication system',
      type: 'Issue',
      dateCreated: '2024-01-14',
      dateUpdated: '2024-01-15',
      assignee: 'Sarah Johnson',
      status: 'Open'
    },
    {
      id: '3',
      name: 'Update risk assessment documentation',
      type: 'Task',
      dateCreated: '2024-01-13',
      dateUpdated: '2024-01-14',
      assignee: 'Mike Davis',
      status: 'Completed'
    },
    {
      id: '4',
      name: 'Network access control misconfiguration',
      type: 'Issue',
      dateCreated: '2024-01-12',
      dateUpdated: '2024-01-13',
      assignee: 'Lisa Wilson',
      status: 'Closed'
    }
  ]);

  // Column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Name',
      field: 'name',
      width: 300,
      cellStyle: { fontWeight: 'bold' },
      pinned: 'left'
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 120,
      cellRenderer: TypeCellRenderer
    },
    {
      headerName: 'Date Created',
      field: 'dateCreated',
      width: 140,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString();
        }
        return '-';
      }
    },
    {
      headerName: 'Date Updated',
      field: 'dateUpdated',
      width: 140,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString();
        }
        return '-';
      }
    },
    {
      headerName: 'Assignee',
      field: 'assignee',
      width: 180,
      cellRenderer: AssigneeCellRenderer
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 130,
      cellRenderer: StatusCellRenderer
    }
  ], []);

  // Grid ready callback
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    suppressMenu: true
  }), []);

  // Row class rules for styling
  const getRowStyle = useCallback((params: any) => {
    if (params.data.type === 'Issue' && params.data.status === 'Open') {
      return { backgroundColor: '#fef2f2' }; // Light red background for open issues
    }
    return { backgroundColor: '#ffffff' };
  }, []);

  const handleCreateIssue = () => {
    if (onCreateIssue) {
      onCreateIssue();
    } else {
      // Default behavior - you can customize this
      console.log('Create Issue clicked');
    }
  };

  const handleCreateTask = () => {
    if (onCreateTask) {
      onCreateTask();
    } else {
      // Default behavior - you can customize this
      console.log('Create Task clicked');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
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
            </div>
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Activities</h3>
            <p className="text-sm text-gray-600 mt-1">Track issues and tasks related to risk management</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleCreateIssue}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Issue
            </button>
            <button 
              onClick={handleCreateTask}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </button>
          </div>
        </div>
      </div>

      {/* AG Grid Container */}
      <div className="h-[600px] w-full">
        {activities.length > 0 ? (
          <div className="ag-theme-alpine h-full w-full">
            <AgGridReact
              rowData={activities}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              getRowStyle={getRowStyle}
              suppressRowClickSelection={true}
              rowSelection="multiple"
              animateRows={true}
              enableCellTextSelection={true}
              suppressCellFocus={true}
              theme="legacy"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
              <p className="text-gray-600">Create issues and tasks to track your risk management activities.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Activities;