import { v4 as uuidv4 } from 'uuid';
import { IProjectContext, ITask} from "@repo/shared";
import { LLMAgent } from './llm.agent';
import { FileAgent } from './file.agent';

export class TaskOrchestrator {
    private executors: Map<string, any>; // Map<ExecutorName, ExecutorInstance>

    constructor() {
        this.executors = new Map();
        // Initialize and Register Executors
        this.executors.set('LLMAgent', new LLMAgent());
        this.executors.set('FileAgent', new FileAgent());
    }

    /**
     * Entry point: Takes a high-level goal and drives the development process.
     * @param goal The user's initial instruction (e.g., "Build a simple to-do list API").
     * @param initialContext The starting project state.
     * @returns The final project context with generated code.
     */
    public async executeGoal(goal: string, initialContext: IProjectContext): Promise<IProjectContext> {
        let context = { ...initialContext };
        let allTasks: ITask[] = [];

        // 1. INITIAL DECOMPOSITION: Start with a planning task
        const firstTaskId = uuidv4();
        const initialTask: ITask = {
            id: firstTaskId,
            projectId: context.projectName, 
            instruction: `Generate a detailed step-by-step plan (as a numbered list) to build the following: ${goal}`, 
            type: 'REFINE', 
            status: 'PENDING', 
            dependencies: [], 
            executor: 'LLMAgent', // The LLM Agent will do the planning
            timestamps: { created: new Date().toISOString() }
        };
        allTasks.push(initialTask);
        context.metadata.initialGoal = goal;
        console.log(`[ORCHESTRATOR] Starting goal: "${goal}" with Task ${firstTaskId.substring(0, 4)}`);

        // 2. MAIN ASYNCHRONOUS EXECUTION LOOP
        let loopCount = 0;
        while (allTasks.some(t => t.status !== 'COMPLETE' && t.status !== 'FAILED') && loopCount < 10) {
            loopCount++;
            
            const runnableTasks = this.getRunnableTasks(allTasks);

            if (runnableTasks.length > 0) {
                console.log(`\n[ORCHESTRATOR: Loop ${loopCount}] Executing ${runnableTasks.length} task(s) concurrently.`);
                
                // Execute and wait for concurrent tasks
                await this.runTasksConcurrently(runnableTasks, allTasks, context);
                
                // 3. POST-EXECUTION RE-DECOMPOSITION
                const completedTasks = runnableTasks.filter(t => t.status === 'COMPLETE');
                
                // Check if the planning task just completed and generate follow-up tasks
                if (completedTasks.some(t => t.id === firstTaskId && t.type === 'REFINE')) {
                    const planOutput = completedTasks.find(t => t.id === firstTaskId)?.output || '';
                    console.log("[ORCHESTRATOR] Initial plan received. Generating first execution tasks...");
                    
                    // A real implementation would parse the plan and generate complex tasks
                    const newTasks = this.parseAndGenerateTasks(context.projectName, firstTaskId, planOutput);
                    allTasks.push(...newTasks);
                }
                
            } else if (allTasks.every(t => t.status !== 'PENDING' && t.status !== 'RUNNING')) {
                // No tasks left to run and none are currently running.
                break;
            } else {
                // Waiting for running tasks to finish
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`\n[ORCHESTRATOR] Goal execution finalized after ${loopCount} loops.`);
        return context;
    }

    /**
     * Finds tasks that are 'PENDING' and have all their dependencies met.
     */
    private getRunnableTasks(tasks: ITask[]): ITask[] {
        const completedIds = tasks.filter(t => t.status === 'COMPLETE').map(t => t.id);
        
        return tasks.filter(task => 
            task.status === 'PENDING' && 
            task.dependencies.every(depId => completedIds.includes(depId))
        );
    }
    
    /**
     * Executes a list of tasks in parallel.
     */
    private async runTasksConcurrently(runnableTasks: ITask[], allTasks: ITask[], context: IProjectContext): Promise<void> {
        // Map tasks to their execution promises (calls to Sub-Agents)
        const executionPromises = runnableTasks.map(task => 
            this.executeSingleTask(task, context, allTasks)
        );

        // Wait for all running tasks to resolve (or reject)
        await Promise.allSettled(executionPromises);
    }
    
    /**
     * Executes a single task by dispatching it to the correct executor.
     */
    private async executeSingleTask(task: ITask, context: IProjectContext, allTasks: ITask[]): Promise<ITask> {
        const executor = this.executors.get(task.executor);

        if (!executor) {
            task.status = 'FAILED';
            task.error = `No executor found for: ${task.executor}`;
            this.logTaskResult(task, context);
            return task;
        }

        task.status = 'RUNNING';
        task.timestamps.started = new Date().toISOString();
        console.log(`   -> [RUNNING] Task ${task.id.substring(0, 4)} (${task.executor})`);

        try {
            let output: string = '';
            
            if (task.executor === 'LLMAgent') {
                // LLM tasks require reasoning/generation
                output = await executor.execute(task, context);
            } else if (task.executor === 'FileAgent' && task.type === 'FILE_IO') {
                // Example of tool use: The instruction contains the content to write in the form "path :: content"
                const instructionStr = typeof task.instruction === 'string' ? task.instruction : '';
                const parts = instructionStr.split('::');
                const filePath = parts[0]?.trim() || '';
                // Join remaining parts in case the content contains '::'
                const content = parts.length > 1 ? parts.slice(1).join('::').trim() : '';
                const mockFileArgs = { 
                    action: 'write', 
                    filePath,
                    content
                };
                output = await executor.execute(mockFileArgs, context);
            }
            // ... Logic for other executors (ShellAgent, etc.) ...

            task.output = output;
            task.status = 'COMPLETE';
            console.log(`   -> [COMPLETE] Task ${task.id.substring(0, 4)}`);

        } catch (error: any) {
            task.status = 'FAILED';
            task.error = error.message || String(error);
            console.error(`   -> [FAILED] Task ${task.id.substring(0, 4)}: ${task.error}`);
        }
        
        this.logTaskResult(task, context);
        return task;
    }
    
    /** Updates the task in the global list and logs to context history. */
    private logTaskResult(task: ITask, context: IProjectContext) {
        task.timestamps.completed = new Date().toISOString();
        context.taskHistory.push({...task});
    }

    /** MOCK: Parses plan output and generates initial file-creation tasks. */
    private parseAndGenerateTasks(projectName: string, dependencyId: string, plan: string): ITask[] {
        console.log(`[DECOMPOSER] Generating tasks based on plan (output length: ${plan.length})`);
        const tasks: ITask[] = [];
        
        // Mocking two initial file tasks for demonstration
        const mockFiles = [
            { path: "src/index.ts", content: "console.log('App starting');" },
            { path: "README.md", content: "# Project Title\nThis was auto-generated." }
        ];

        mockFiles.forEach((file, index) => {
            tasks.push({
                id: uuidv4(),
                projectId: projectName,
                // Using '::' to simulate structured data from an LLM for the FileAgent
                instruction: `${file.path} :: ${file.content}`,
                type: 'FILE_IO', 
                status: 'PENDING',
                dependencies: [dependencyId],
                executor: 'FileAgent',
                timestamps: { created: new Date().toISOString() }
            });
        });
        return tasks;
    }
}