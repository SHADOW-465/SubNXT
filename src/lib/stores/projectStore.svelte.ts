export interface Project {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    status: "draft" | "processing" | "completed" | "error";
    mediaType: "video" | "audio";
    mediaUrl?: string; // Blob URL or Server URL
    duration?: number;
    subtitles: Subtitle[];
    language: string;
}

export interface Subtitle {
    id: string;
    startTime: number;
    endTime: number;
    text: string;
    speaker?: string;
    confidence?: number;
}

class ProjectStore {
    projects = $state<Project[]>([]);
    isLoading = $state(false);

    constructor() {}

    async loadProjects() {
        this.isLoading = true;
        try {
            // First load from localStorage for offline support
            const localData = localStorage.getItem("subgen-projects");
            let localProjects: Project[] = [];
            if (localData) {
                localProjects = JSON.parse(localData);
            }

            // Then try to sync with server
            try {
                const res = await fetch("/api/projects");
                if (res.ok) {
                    const serverProjects = await res.json();
                    // Simple merge strategy: Server wins if ID matches, otherwise add unique
                    // For now, let's just use server as truth if available, or merge.
                    // This is a simplification.
                    this.projects = serverProjects;
                    // Update local storage
                    localStorage.setItem("subgen-projects", JSON.stringify(this.projects));
                } else {
                    this.projects = localProjects;
                }
            } catch (e) {
                console.warn("Server unreachable, using local data", e);
                this.projects = localProjects;
            }

        } catch (e) {
            console.error("Failed to load projects", e);
        } finally {
            this.isLoading = false;
        }
    }

    async addProject(project: Project) {
        this.projects = [project, ...this.projects];
        this.saveProjects();
    }

    async updateProject(id: string, updates: Partial<Project>) {
        this.projects = this.projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
        this.saveProjects();
    }

    async deleteProject(id: string) {
        this.projects = this.projects.filter(p => p.id !== id);
        this.saveProjects();
    }

    async getProject(id: string): Promise<Project | undefined> {
        if (this.projects.length === 0) {
            await this.loadProjects();
        }
        return this.projects.find(p => p.id === id);
    }

    async saveProjects() {
        // Save to local
        localStorage.setItem("subgen-projects", JSON.stringify(this.projects));

        // Sync to server
        try {
            await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.projects)
            });
        } catch (e) {
            console.warn("Failed to sync with server", e);
        }
    }
}

export const projectStore = new ProjectStore();
