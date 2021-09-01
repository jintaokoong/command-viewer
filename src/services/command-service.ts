import { ApiCommand } from 'interfaces/api/api-command'

const fetchCommands = () => {
  return fetch(
    'https://api.streamelements.com/kappa/v2/store/6005968629554566d767e73e/items?source=website').
    then(response => response.json()).
    then((data: ApiCommand[]) => data)
}

const CommandService = {
  fetchCommands: fetchCommands,
}

export default CommandService;
