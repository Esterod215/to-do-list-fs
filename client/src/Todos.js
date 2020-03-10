import React, { useState } from "react";

import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";

function Todos() {
  //GraphQL section
  const GET_TODOS = gql`
    query Todos {
      todos {
        id
        text
        complete
      }
    }
  `;

  const UPDATE_TODO = gql`
    mutation UpdateTodo($id: ID!, $complete: Boolean!) {
      updateTodo(id: $id, complete: $complete)
    }
  `;
  const DELETE_TODO = gql`
    mutation RemoveTodo($id: ID!) {
      removeTodo(id: $id)
    }
  `;

  const CREATE_TODO = gql`
    mutation CreateTodo($text: String!) {
      createTodo(text: $text) {
        id
        complete
        text
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_TODOS);

  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: mutationResult => [{ query: GET_TODOS }]
  });

  const [removeTodo] = useMutation(DELETE_TODO, {
    refetchQueries: mutationResult => {
      return [{ query: GET_TODOS }];
    }
  });
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: mustationResult => [{ query: GET_TODOS }]
  });

  //Modal section
  const [open, setOpen] = useState(false);

  const handleModal = () => {
    setOpen(!open);
  };

  const useStyles = makeStyles(theme => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  }));

  const classes = useStyles();

  //state for input
  const [task, setTask] = useState("");
  const handleChanges = e => {
    e.preventDefault();
    setTask(e.target.value);
  };

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ width: 400 }}>
        {data.todos.length ? (
          <List>
            {data.todos.map(todo => {
              const labelId = `checkbox-list-label-${todo}`;

              return (
                <ListItem key={todo.id} role={undefined} dense button>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={todo.complete}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      onClick={() => {
                        updateTodo({
                          variables: { id: todo.id, complete: !todo.complete }
                        });
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={todo.text} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <CloseIcon
                        onClick={() => {
                          removeTodo({ variables: { id: todo.id } });
                        }}
                      />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <h4 style={{ textAlign: "center" }}>There are no current tasks.</h4>
        )}
      </div>
      <div>
        <Button variant="outlined" color="primary" onClick={handleModal}>
          Add a Task
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Create a Task</h2>
              <form
                type="submit"
                onSubmit={() => {
                  createTodo({ variables: { text: task } });
                  setTask("");
                }}
              >
                <label>
                  Task:
                  <input
                    type="text"
                    value={task}
                    onChange={handleChanges}
                    style={{
                      marginLeft: "20px",

                      width: "60%"
                    }}
                  />
                </label>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    createTodo({ variables: { text: task } });
                    handleModal();
                    setTask("");
                  }}
                  style={{
                    display: "block",
                    marginTop: "10px",
                    margin: "20px auto"
                  }}
                >
                  Add a Task
                </Button>
              </form>
            </div>
          </Fade>
        </Modal>
      </div>
    </div>
  );
}
export default Todos;
