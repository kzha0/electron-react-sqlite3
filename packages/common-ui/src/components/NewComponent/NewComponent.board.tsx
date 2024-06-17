import { createBoard } from '@wixc3/react-board';
import { NewComponent } from './NewComponent';

export default createBoard({
    name: 'NewComponent',
    Board: () => <NewComponent />,
    isSnippet: true,
});
