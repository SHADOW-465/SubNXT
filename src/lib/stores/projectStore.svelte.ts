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
                    // - Create a map of existing projects by ID
                    const projectMap = new Map<string, Project>();

                    // Add local projects first
                    localProjects.forEach(p => projectMap.set(p.id, p));

                    // Merge server projects
                    serverProjects.forEach(serverP => {
                        const localP = projectMap.get(serverP.id);
                        if (!localP) {
                            // If not in local, add it
                            projectMap.set(serverP.id, serverP);
                        } else {
                            // If exists in both, compare updatedAt
                            // If server is newer, use server. Else keep local (preserves unsynced changes)
                            const serverDate = new Date(serverP.updatedAt).getTime();
                            const localDate = new Date(localP.updatedAt).getTime();

                            if (serverDate > localDate) {
                                projectMap.set(serverP.id, serverP);
                            }
                        }
                    });

                    // Update state with merged list
                    this.projects = Array.from(projectMap.values())
                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

                    // Update local storage with the merged result
                    localStorage.setItem("subgen-projects", JSON.stringify(this.projects));
                }
            } catch (e) {
                console.warn("Server unreachable, keeping local data", e);
                // We already set this.projects = localProjects above, so no action needed.
            }

        } catch (e) {
            console.error("Failed to load projects", e);
        } finally {
            this.isLoading = false;
        }
    }

    async addProject(project: Project) {
        // Add to local state immediately
        this.projects = [project, ...this.projects];
        // Save (Local + Async Server)
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
        // If empty, try loading.
        // Note: loadProjects handles merging, so calling it again is safe/idempotent-ish.
        if (this.projects.length === 0) {
            await this.loadProjects();
        }

        // If still not found, it might be that loadProjects is async and we need to wait for the merge?
        // But loadProjects awaits the fetch.
        // However, if we just navigated from Dashboard, `projects` might already have it from `addProject`.
        // If we hard-refreshed, `loadProjects` runs.

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
