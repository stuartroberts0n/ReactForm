import * as React from 'react';
import { IReactFormProps } from './IReactFormProps';
import { getSP, SPFI } from '../../../pnpjsConfig';
import { PrimaryButton, DetailsList, SelectionMode, TextField } from 'office-ui-fabric-react';

// type definitions
interface IQuoteRes {
  Title: string;
  Author0: string;
  Id: number;
}

interface IQuote {
  quote: string;
  author: string;
  id: number;
}

const ReactForm = (props: IReactFormProps): React.ReactElement => {
  const _sp: SPFI = getSP(props.spcontext);
  const [reload, setReload] = React.useState<boolean>(false);
  const [quotes, setQuotes] = React.useState<Array<IQuote>>([]);
  const [newQuote, setNewQuote] = React.useState<string>('');
  const [newAuthor, setNewAuthor] = React.useState<string>('');

  // use effect hook to call function each time page reloads
  React.useEffect(() => {
    getListItems();
  }, [reload])

  const getListItems = async () => {
    //this function gets list items from the site specified in the serve.json file 
    try {
      //fetching the list items
      const getListItems = await _sp.web.lists.getByTitle('Quotes').items();
      //setting the list items to a state variable
      setQuotes(getListItems.map((each: IQuoteRes) => ({
        quote: each.Title,
        author: each.Author0,
        id: each.Id
      })))
    } catch (e) {
      //log any errors if there are any
      console.log(e);
    } finally {
      console.log('List items fetched', quotes);
    }
  }

  const handleQuote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuote(event.target.value);
  };

  const handleAuthor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAuthor(event.target.value);
  };

  const addNewListItem = async () => {
    // Get a reference to the SharePoint list named "Quotes"
    const list = _sp.web.lists.getByTitle("Quotes");
    try {
      // Add a new item to the list with the provided values
      await list.items.add({
        Title: newQuote,
        Author0: newAuthor
      });
      // Trigger a reload by toggling the 'reload' state variable
      setReload(!reload);
      // Log a message to indicate that the list item has been successfully added
      console.log('List item added');
    } catch (e) {
      // Log any errors that occur during the addition process
      console.log(e);
    } finally {

    }
  }


  return (
    <>
      <h1>React Form Template</h1>
      <div className='quoteBox'>
        <h2>Sample Data</h2>
        <div className='quoteContainer'>
          <DetailsList
            items={quotes || []}
            columns={[
              {
                key: 'quoteColumn',
                name: 'Quote',
                fieldName: 'quote',
                minWidth: 200,
                isResizable: true,
                onRender: (item: IQuote) => <div>{item.quote}</div>,
              },
              {
                key: 'authorColumn',
                name: 'Author',
                fieldName: 'author',
                minWidth: 100,
                isResizable: true,
                onRender: (item: IQuote) => <div>{item.author}</div>,
              },
            ]}
            selectionMode={SelectionMode.none}
          />
        </div>
      </div>
      <div>
        <div>
            <TextField
              label="Quote"
              value={newQuote}
              onChange={handleQuote}
            />
            <TextField
              label="Author"
              value={newAuthor}
              onChange={handleAuthor}
            />         
        </div>
        <div>
            <PrimaryButton text="Submit" onClick={() => addNewListItem()} />   
        </div>
      </div>
    </>
  )
}
export default ReactForm;