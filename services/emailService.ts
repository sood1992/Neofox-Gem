
import { Task, User, UserRole, TaskStatus } from '../types';
import { StorageService } from './storageService';

export const EmailService = {
    
    /**
     * Sends an email via the PHP backend
     */
    send: async (to: string[], subject: string, htmlContent: string) => {
        // remove duplicates
        const uniqueEmails = [...new Set(to)];
        
        if (uniqueEmails.length === 0) return;

        // In Local/Demo mode, we just log to console to avoid API errors
        // If you want to test with api.php, uncomment the fetch call
        console.log(`[EmailService] Sending to: ${uniqueEmails.join(', ')}`);
        console.log(`[EmailService] Subject: ${subject}`);
        
        try {
            await fetch('api.php?action=send_email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: uniqueEmails.join(','),
                    subject: subject,
                    message: htmlContent
                })
            });
        } catch (e) {
            console.warn("Failed to send email via API. Ensure api.php is uploaded.", e);
        }
    },

    /**
     * Helper to get Admin + PM emails
     */
    getManagementEmails: (): string[] => {
        const users = StorageService.getUsers();
        return users
            .filter(u => u.role === UserRole.ADMIN || u.role === UserRole.PROJECT_MANAGER)
            .map(u => u.email)
            .filter(email => !!email);
    },

    /**
     * Triggers when a task is created
     */
    notifyTaskAssignment: async (task: Task, assigneeId: string) => {
        const users = StorageService.getUsers();
        const assignee = users.find(u => u.id === assigneeId);
        const project = StorageService.getProjects().find(p => p.id === task.projectId);
        
        if (!assignee) return;

        const managementEmails = EmailService.getManagementEmails();
        const recipients = [assignee.email, ...managementEmails];

        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #7367f0;">New Task Assigned</h2>
                <p>Hello <strong>${assignee.name}</strong>,</p>
                <p>You have been assigned a new task on <strong>Foxhole</strong>.</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Task:</strong> ${task.title}</p>
                    <p style="margin: 5px 0;"><strong>Project:</strong> ${project?.title || 'General'}</p>
                    <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="color: ${task.priority === 'URGENT' ? 'red' : 'black'}">${task.priority}</span></p>
                    <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                
                <p>Please log in to view details and start tracking time.</p>
                <a href="https://neofoxmedia.com/foxhole" style="background: #7367f0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Open Foxhole</a>
            </div>
        `;

        await EmailService.send(recipients, `New Task: ${task.title}`, html);
    },

    /**
     * Triggers when a task status changes (e.g. Completed)
     */
    notifyTaskUpdate: async (task: Task, previousStatus: TaskStatus, actorName: string) => {
        const users = StorageService.getUsers();
        const assignee = users.find(u => u.id === task.assigneeId);
        const managementEmails = EmailService.getManagementEmails();
        
        // If the assignee updated it, notify management. If management updated it, notify assignee.
        // Simply notifying everyone is safer.
        const recipients = assignee ? [assignee.email, ...managementEmails] : managementEmails;

        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #28c76f;">Task Update</h2>
                <p>The task <strong>${task.title}</strong> has been updated by ${actorName}.</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Status Change:</strong> ${previousStatus} ➝ <strong>${task.status}</strong></p>
                </div>
                
                ${task.status === TaskStatus.DONE ? '<p><strong>Great job!</strong> This task is now marked as complete.</p>' : ''}
            </div>
        `;

        await EmailService.send(recipients, `Update: ${task.title} is ${task.status}`, html);
    }
};
