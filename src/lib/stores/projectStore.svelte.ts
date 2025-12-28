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
    targetLanguage?: string;
    style: SubtitleStyle;
}

export interface Subtitle {
    id: string;
    startTime: number;
    endTime: number;
    text: string;
    speaker?: string;
    confidence?: number;
}

export interface SubtitleStyle {
    fontFamily: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    opacity: number;
    position: 'top' | 'middle' | 'bottom';
    animation: 'none' | 'fade' | 'pop' | 'slide';
}

export const DEFAULT_STYLE: SubtitleStyle = {
    fontFamily: 'Inter',
    fontSize: 24,
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    opacity: 1,
    position: 'bottom',
    animation: 'fade'
};

class ProjectStore {
    projects = $state<Project[]>([]);
    isLoading = $state(false);

    constructor() {}

    async loadProjects() {
        this.isLoading = true;
        try {
            // 1. Load from localStorage (Synchronous, fast, immediate availability)
            const localData = localStorage.getItem("subgen-projects");
            let localProjects: Project[] = [];
            if (localData) {
                localProjects = JSON.parse(localData);
            }

            // Set initial state from local storage so UI renders immediately
            this.projects = localProjects;

            // 2. Sync with server (Async)
            try {
                const res = await fetch("/api/projects");
                if (res.ok) {
                    const serverProjects: Project[] = await res.json();

                    // 3. Merge Strategy:
                    const projectMap = new Map<string, Project>();

                    localProjects.forEach(p => projectMap.set(p.id, p));

                    serverProjects.forEach(serverP => {
                        const localP = projectMap.get(serverP.id);
                        if (!localP) {
                            projectMap.set(serverP.id, serverP);
                        } else {
                            const serverDate = new Date(serverP.updatedAt).getTime();
                            const localDate = new Date(localP.updatedAt).getTime();

                            if (serverDate > localDate) {
                                projectMap.set(serverP.id, serverP);
                            }
                        }
                    });

                    this.projects = Array.from(projectMap.values())
                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

                    localStorage.setItem("subgen-projects", JSON.stringify(this.projects));
                }
            } catch (e) {
                console.warn("Server unreachable, keeping local data", e);
            }

        } catch (e) {
            console.error("Failed to load projects", e);
        } finally {
            this.isLoading = false;
        }
    }

    async addProject(project: Project) {
        // Ensure styles are initialized
        if (!project.style) {
            project.style = { ...DEFAULT_STYLE };
        }
        this.projects = [project, ...this.projects];
        await this.saveProjects();
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
        localStorage.setItem("subgen-projects", JSON.stringify(this.projects));

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
