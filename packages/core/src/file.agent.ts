import * as fs from 'fs/promises';
import * as path from 'path';
import { IProjectContext, IAgentTool } from '@repo/shared';

/**
 * Implements the file system tool definition for the Orchestrator.
 */
export class FileAgent implements IAgentTool {
    public name = 'FileEditor';
    public description = 'Reads, writes, or deletes files in the project directory. Use this when code needs to be saved or reviewed.';
    public parameters: Record<string, "string" | "number" | "boolean"> = {
        action: 'string', // 'read', 'write', 'delete'
        filePath: 'string',
        content: 'string' // Only required for 'write'
    };

    /**
     * Executes a file system operation and updates the project context.
     */
    public async execute(args: Record<string, any>, context: IProjectContext): Promise<string> {
        const { action, filePath, content } = args;
        const fullPath = path.join(process.cwd(), context.projectName, filePath);

        if (action === 'write') {
            const status = context.fileSystem.some(f => f.filePath === filePath) ? 'MODIFIED' : 'ADDED';
            
            // 1. Write the file to the local disk (simulating actual file creation)
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, content, 'utf-8');
            
            // 2. Update the Context/Memory
            const existingIndex = context.fileSystem.findIndex(f => f.filePath === filePath);
            if (existingIndex > -1) {
                context.fileSystem[existingIndex] = { filePath, content, status };
            } else {
                context.fileSystem.push({ filePath, content, status });
            }
            
            return `File successfully written/updated at: ${filePath}`;
        } 
        // ... (Add 'read' and 'delete' logic here later)
        
        return `Unsupported action: ${action}`;
    }
}