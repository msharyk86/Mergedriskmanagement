import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, CellValueChangedEvent, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Edit, FileText, MoreHorizontal, Plus, Eye } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface Control {
  id: string;
  name: string;
  type: 'existing' | 'recommended';
  libraryName?: string;
  controlInstanceId?: string;
  controlTester?: string;
  controlOwner?: string;
  controlOperations?: string;
  controlDefinitionCategory?: string;
  controlType?: string;
  controlCategory?: string;
  description?: string;
  effectiveness: number;
  implemented: number;
  weight: number;
  controlStrength?: number;
  actions?: string;
}

interface ControlManagementProps {
  controls: Control[];
  onEditControl: (id: string) => void;
  onAuditLog: (id: string) => void;
  onAddRecommended: (id: string) => void;
  onMoreActions: (id: string) => void;
}

// Custom cell renderer for type badges
const TypeCellRenderer = (params: any) => {
  const isRecommended = params.value === 'recommended';
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      isRecommended 
        ? 'bg-green-100 text-green-800' 
        : 'bg-blue-100 text-blue-800'
    }`}>
      {isRecommended ? 'Best Practice Control' : 'Control'}
    </span>
  );
};

// Custom cell renderer for actions
const ActionsCellRenderer = (params: any) => {
  const { data, context } = params;
  const isRecommended = data.type === 'recommended';

  if (isRecommended) {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={() => context.onAddRecommended(data.id)}
          className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500 transition-colors"
          title="Add as Active Control"
        >
          <Plus className="w-3 h-3 mr-0.5" />
          Add
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-1">
      <button
        onClick={() => context.onAuditLog(data.id)}
        className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
        title="Audit Log"
      >
        <FileText className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => context.onEditControl(data.id)}
        className="p-0.5 text-gray-400 hover:text-blue-600 transition-colors"
        title="Edit Control"
      >
        <Edit className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => context.onMoreActions(data.id)}
        className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
        title="More Actions"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// Custom cell renderer for numeric inputs
const NumericInputCellRenderer = (params: any) => {
  const { value, data, colDef, api } = params;
  const isRecommended = data.type === 'recommended';

  if (isRecommended) {
    return (
      <input
        type="number"
        value=""
        disabled
        className="w-full px-1 py-0.5 text-xs text-center border border-gray-200 rounded bg-gray-50 cursor-not-allowed"
      />
    );
  }

  return (
    <input
      type="number"
      min="0"
      max="100"
      value={value || 0}
      onChange={(e) => {
        const newValue = parseInt(e.target.value) || 0;
        data[colDef.field] = newValue;
        api.refreshCells({ rowNodes: [params.node], columns: [colDef.field] });
      }}
      className="w-full px-1 py-0.5 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    />
  );
};

const ControlManagement: React.FC<ControlManagementProps> = ({
  controls,
  onEditControl,
  onAuditLog,
  onAddRecommended,
  onMoreActions
}) => {
  const [gridApi, setGridApi] = useState<any>(null);

  // Column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Type',
      field: 'type',
      width: 200,
      cellRenderer: TypeCellRenderer,
      pinned: 'left'
    },
    {
      headerName: 'Library Name',
      field: 'libraryName',
      width: 200,
      valueFormatter: (params) => params.value || '-'
    },
    {
      headerName: 'Control Instance Id',
      field: 'controlInstanceId',
      width: 180,
      valueFormatter: (params) => params.value || '-'
    },
    {
      headerName: 'Effectiveness',
      field: 'effectiveness',
      width: 120,
      cellRenderer: NumericInputCellRenderer,
      editable: false
    },
    {
      headerName: 'Implemented',
      field: 'implemented',
      width: 120,
      cellRenderer: NumericInputCellRenderer,
      editable: false
    },
    {
      headerName: 'Weight',
      field: 'weight',
      width: 100,
      cellRenderer: NumericInputCellRenderer,
      editable: false
    },
    {
      headerName: 'Control Strength',
      field: 'controlStrength',
      width: 140,
      valueFormatter: (params) => params.value || '0',
      cellStyle: { textAlign: 'center' }
    },
    {
      headerName: 'Control Tester',
      field: 'controlTester',
      width: 150,
      valueFormatter: (params) => params.value || '-'
    },
    {
      headerName: 'Control Owner',
      field: 'controlOwner',
      width: 150,
      valueFormatter: (params) => params.value || '-'
    },
    {
      headerName: 'Control Operations',
      field: 'controlOperations',
      width: 180,
      valueFormatter: (params) => params.value || '-'
    },
    {
      headerName: 'Control Definition Category',
      field: 'controlDefinitionCategory',
      width: 220,
      valueFormatter: (params) => params.value || '-'
    },
    {
      headerName: 'Control Type',
      field: 'controlType',
      width: 140,
      valueFormatter: (params) => params.value || '-'
    },
    {
      headerName: 'Control Category',
      field: 'controlCategory',
      width: 160,
      valueFormatter: (params) => params.value || '-'
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 200,
      cellStyle: { fontWeight: 'bold' }
    },
    {
      headerName: 'Description',
      field: 'description',
      width: 250,
      valueFormatter: (params) => params.value || '-',
      cellStyle: { color: '#6b7280' }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 100,
      cellRenderer: ActionsCellRenderer,
      pinned: 'right',
      sortable: false,
      filter: false
    }
  ], []);

  // Grid context for passing callbacks
  const gridContext = useMemo(() => ({
    onEditControl,
    onAuditLog,
    onAddRecommended,
    onMoreActions
  }), [onEditControl, onAuditLog, onAddRecommended, onMoreActions]);

  // Grid ready callback
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  // Row data with grouping
  const rowData = useMemo(() => {
    const existingControls = controls.filter(c => c.type === 'existing');
    const recommendedControls = controls.filter(c => c.type === 'recommended');
    
    return [
      ...existingControls,
      ...recommendedControls
    ];
  }, [controls]);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    suppressMenu: true
  }), []);

  // Row class rules for styling
  const getRowStyle = useCallback((params: any) => {
    if (params.data.type === 'recommended') {
      return { backgroundColor: '#f0fdf4' }; // Light green background for recommended
    }
    return { backgroundColor: '#ffffff' };
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Control Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage existing controls and review recommended best practices</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Add Control Group
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Add Control Instance
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Link Control Instance
            </button>
          </div>
        </div>
      </div>

      {/* AG Grid Container */}
      <div className="h-[600px] w-full">
        {controls.length > 0 ? (
          <div className="ag-theme-alpine h-full w-full">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              context={gridContext}
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
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Controls Found</h3>
              <p className="text-gray-600">Add controls to manage risk assessment and compliance.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlManagement;