import axios from '../axios.config'
import withAuth from './withAuth'
import { IRequest, Project, ProjectPreUpload } from '../@types'

type APIKeyType = {
  GOOGLE_MAP_API_KEY: string
  A_MAP_API_KEY: string
  A_MAP_WEB_API_KEY: string
}

const getApiKeyRequest = (username: string, jwtToken: string) =>
  axios
    .get<APIKeyType>('/apikeysender', {
      headers: { 'COG-TOKEN': jwtToken },
    })
    .then(res => res.data)

const createProjectRequest = (
  values: ProjectPreUpload,
  username: string,
  jwtToken: string
): Promise<Project> =>
  axios
    .post<Project>(`/project/${username}`, values, {
      headers: { 'COG-TOKEN': jwtToken },
    })
    .then(res => res.data)

const getProjectRequest = (username: string, jwtToken: string): Promise<Project[]> =>
  axios
    .get<Project[]>(`/project/${username}`, {
      headers: { 'COG-TOKEN': jwtToken },
    })
    .then(res => res.data)

const deleteProjectRequest = (
  username: string,
  jwtToken: string,
  projectID: string
): Promise<void> =>
  axios
    .delete<void>(`/project/${username}`, {
      params: { projectID: projectID },
      headers: { 'COG-TOKEN': jwtToken },
    })
    .then(res => res.data)

export const getApiKey = () =>
  withAuth(({ username, jwtToken }) => getApiKeyRequest(username, jwtToken))
export const createProject = (values: ProjectPreUpload) =>
  withAuth(({ username, jwtToken }) => createProjectRequest(values, username, jwtToken))
export const getProject: IRequest<void, Project[]> = () => withAuth(getProjectRequest)
export const deleteProject: IRequest<string, void> = projectID =>
  withAuth(deleteProjectRequest, projectID)
