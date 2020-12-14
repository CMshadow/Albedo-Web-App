import axios from '../axios.config'
import injectAuth from './injectAuth'
import { IAxiosRequest, Project, ProjectPreUpload } from '../@types'

type APIKeyType = {
  GOOGLE_MAP_API_KEY: string
  A_MAP_API_KEY: string
  A_MAP_WEB_API_KEY: string
}

const getApiKeyRequest: IAxiosRequest<{ jwtToken: string }, APIKeyType> = args =>
  axios
    .get<APIKeyType>('/apikeysender', {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const createProjectRequest: IAxiosRequest<
  { values: ProjectPreUpload; username: string; jwtToken: string },
  Project
> = args =>
  axios
    .post<Project>(`/project/${args.username}`, args.values, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const getProjectRequest: IAxiosRequest<{ username: string; jwtToken: string }, Project[]> = args =>
  axios
    .get<Project[]>(`/project/${args.username}`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const deleteProjectRequest: IAxiosRequest<
  { projectID: string; username: string; jwtToken: string },
  void
> = args =>
  axios
    .delete<void>(`/project/${args.username}`, {
      params: { projectID: args.projectID },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const getProjectSingleRequest: IAxiosRequest<
  { projectID: string; username: string; jwtToken: string },
  Project
> = args =>
  axios
    .get<Project>(`/project/${args.username}/${args.projectID}`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const saveProjectRequest: IAxiosRequest<
  { projectID: string; values: Project; username: string; jwtToken: string },
  { Attributes: Project }
> = args =>
  axios
    .put<{ Attributes: Project }>(`/project/${args.username}/${args.projectID}`, args.values, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

export const getApiKey = injectAuth(getApiKeyRequest)
export const createProject = injectAuth(createProjectRequest)
export const getProject = injectAuth(getProjectRequest)
export const deleteProject = injectAuth(deleteProjectRequest)
export const getProjectSingle = injectAuth(getProjectSingleRequest)
export const saveProject = injectAuth(saveProjectRequest)
