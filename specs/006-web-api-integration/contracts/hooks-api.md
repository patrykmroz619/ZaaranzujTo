# Hooks API Contract

**Feature**: 006-web-api-integration
**Date**: 2026-03-29

Defines the public interface of each React Query hook to be created. All hooks follow the established `useProfile` pattern.

## Query Hooks

### useProjects

```
Input:  { query?: { page, pageSize, sort } }
Output: { projects: TListProjectsResponse | undefined, isLoading: boolean, error: Error | null }
Key:    ["projects"]
Source: projectsApi.list()
```

### useProject

```
Input:  { projectId: string }
Output: { project: TGetProjectResponse | undefined, isLoading: boolean, error: Error | null }
Key:    ["projects", projectId]
Source: projectsApi.get()
```

### useProjectVisualizations

```
Input:  { projectId: string, query?: { page, pageSize, sort } }
Output: { visualizations: TListProjectVisualizationsResponse | undefined, isLoading: boolean, error: Error | null }
Key:    ["projects", projectId, "visualizations"]
Source: visualizationsApi.list()
```

### useVisualization

```
Input:  { visualizationId: string }
Output: { visualization: TVisualizationDetails | undefined, isLoading: boolean, error: Error | null }
Key:    ["visualizations", visualizationId]
Source: visualizationsApi.get()
```

### useIterations

```
Input:  { visualizationId: string, query?: { page, pageSize, sort } }
Output: { iterations: TListVisualizationIterationsResponse | undefined, isLoading: boolean, error: Error | null }
Key:    ["visualizations", visualizationId, "iterations"]
Source: iterationsApi.list()
```

### useCreditPackages

```
Input:  none
Output: { packages: TGetCreditPackagesResponse | undefined, isLoading: boolean, error: Error | null }
Key:    ["credits", "packages"]
Source: creditsApi.getPackages()
Options: staleTime: 5 * 60 * 1000 (5 minutes)
```

### useCreditBalance

```
Input:  none
Output: { balance: TCreditBalance | undefined, isLoading: boolean, error: Error | null }
Key:    ["credits", "balance"]
Source: creditsApi.getBalance()
```

### useAssetUrl

```
Input:  { assetId: string | null | undefined }
Output: { url: string | null, isLoading: boolean }
Key:    ["storage", "asset", assetId]
Source: storageApi.getDownloadUrl() (new — needs API module or inline fetch)
Options: staleTime: 50 * 60 * 1000 (50 minutes), enabled: !!assetId
```

## Mutation Hooks

### useCreateProject

```
Input:  { body: TCreateProjectRequest }
Output: { mutate, mutateAsync, isPending, error }
Source: projectsApi.create()
Invalidates: ["projects"]
```

### useUpdateProject

```
Input:  { projectId: string, body: TUpdateProjectRequest }
Output: { mutate, mutateAsync, isPending, error }
Source: projectsApi.update()
Invalidates: ["projects"], ["projects", projectId]
```

### useDeleteProject

```
Input:  { projectId: string }
Output: { mutate, mutateAsync, isPending, error }
Source: projectsApi.delete()
Invalidates: ["projects"]
```

### useCreateVisualization

```
Input:  { projectId: string, body: TCreateVisualizationRequest, headers: TCreateVisualizationHeaders }
Output: { mutate, mutateAsync, isPending, error }
Source: visualizationsApi.create()
Invalidates: ["projects", projectId, "visualizations"], ["projects", projectId]
```

### useCreateIteration

```
Input:  { visualizationId: string, formData: FormData, headers: TCreateIterationHeaders }
Output: { mutate, mutateAsync, isPending, error, data }
Source: iterationsApi.create() (updated for multipart)
Invalidates: ["visualizations", vizId], ["visualizations", vizId, "iterations"], ["profile"]
```

### useUpdateProfile

```
Input:  { body: TUpdateMeRequest }
Output: { mutate, mutateAsync, isPending, error }
Source: meApi.updateProfile()
Invalidates: ["profile"]
```

## Error Handling Convention

All hooks expose the `error` field from React Query. Components should:
1. Check `error instanceof ApiError` for typed error handling
2. Use `error.statusCode` to determine the appropriate user-facing message
3. Display errors via toast notifications (mutations) or inline error states (queries)
4. Map status codes to Polish i18n keys from `pl.json`
