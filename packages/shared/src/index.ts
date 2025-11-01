export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETE' | 'FAILED' | 'BLOCKED';
export type TaskType = 'CODE_GEN' | 'TEST_GEN' | 'FILE_IO' | 'SHELL_EXEC' | 'DEBUG' | 'REFINE';

export interface ITask {
    id: string;
    projectId: string; 
    instruction: string;
    type: TaskType;
    status: TaskStatus;
    dependencies: string[];
    executor: string; 
    output?: string;
    timestamps: {
        created: string;
        started?: string;
        completed?: string;
    };
    error?: string;
}


export interface IFileChange {
    filePath: string;
    content: string;
    status: 'ADDED' | 'MODIFIED' | 'DELETED';
}

export interface IProjectContext {
    projectName: string;
    fileSystem: IFileChange[];
    taskHistory: ITask[];
    metadata: Record<string, any>;
}


export interface IAgentTool {
    name: string;
    description: string;
    parameters: Record<string, 'string' | 'number' | 'boolean'>;
    execute: (args: Record<string, any>, context: IProjectContext) => Promise<string>;
}