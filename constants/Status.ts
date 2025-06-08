export const TaskStatusConst = {
    in_processing:'Em andamento',
    finished:'Finalizada',
    new_task:'Nova Tarefa',
} as const

export type TaskStatusType = (typeof TaskStatusConst)[keyof typeof TaskStatusConst];