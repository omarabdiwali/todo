import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '70%',
      backgroundColor: theme.palette.background.paper,
      margin: "0",
      position: "absolute",
      top: "30%",
      left: "14%",
    }
  }),
);

interface Todo {
  item: string;
  checked: boolean
}

export default function TodoApp() {
  const classes = useStyles();
  const [checked, setChecked] = useState<number[]>([]);
  const [items, setItems] = useState<Todo[]>([]);
  let l : number[] = [];
  
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const todos = window.localStorage.getItem("todos");
    if (todos) {
      setItems(JSON.parse(todos));
    };
  }, [])

  const checkBox = (value: number) => () => {
    const todoItem = items[value];
    const currentIndex = l.indexOf(value);
    let newChecked: number[] = [];

    if (checked.length === 0) {
      newChecked = [...l];
    }
    else {
      newChecked = [...checked];
    }

    let newList = items;
    todoItem.checked = !todoItem.checked;

    newList.splice(value, 1, todoItem);

    if (currentIndex === -1) {
      newChecked.push(value);
    }
    else {
      newChecked.splice(currentIndex, 1);
    }
    
    setChecked(newChecked);
    setItems(newList);

    window.localStorage.setItem("todos", JSON.stringify(newList));
  };

  function deleteItem(e: React.MouseEvent<HTMLButtonElement>) {
    const idx = parseInt(e.currentTarget.id);
    const newList = items.filter((_ : Todo, i : number) => i !== idx);
    setItems(newList);
    
    window.localStorage.setItem("todos", JSON.stringify(newList));
  }

  function onChangeText(e: React.ChangeEvent<HTMLInputElement>) {
    setTodo(e.currentTarget.value);
  }

  function addItem() {
    const removeSpaces = todo.replace(/ /g, "");
    if (removeSpaces.length !== 0) {
      const newItems = [...items, { item: todo, checked: false }]
      setItems(newItems);
      window.localStorage.setItem("todos", JSON.stringify(newItems));
    }
    setTodo("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addItem();
  }
  
  return (
    <div style={{overflow: "scroll"}}>
      <form onSubmit={submit}>
        <TextField
          id="outlined-full-width"
          label="Item"
          style={{ margin: 8, width: "70%", position: "absolute", top: "5%", left: "12%" }}
          placeholder="Add Item"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={todo}
          onChange={onChangeText}
        />
        <Fab size={window.innerWidth > 500 ? "large" : "medium"} style={{ float: "right", margin: 32, marginRight: window.innerWidth > 500 ? "10%" : "1%"}} onClick={addItem}>
          <AddIcon />
        </Fab>
      </form>
      <List className={classes.root}>
        <Typography variant={window.innerWidth > 500 ? "h3" : "h5"} style={{marginLeft: "35%"}}>Todo Items:</Typography>
        {items.length > 0 ? items.map((value: Todo, i :number) => {
          const labelId = `checkbox-list-label-${value}`;
          if (value.checked) {
            l.push(i);
          }
          return (
            <ListItem key={i} role={undefined} button onClick={checkBox(i)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={l.indexOf(i) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.item}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="comments" onClick={deleteItem} id={`${i}`}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        }): ""}
      </List>
      </div>
  );
}
