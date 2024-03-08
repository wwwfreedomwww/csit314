import {
  TextInput,
  NumberInput,
  Button,
  Container,
  Grid,
  Tabs,
} from "@mantine/core";
import "./Components/ViewSeats/ViewHallStyle.css";
import { MdChair } from "react-icons/md";
import SeatMap from "./Components/ViewSeats/SeatMap";
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import ViewMovieSession from "./ViewMovieSession";

function ViewHall() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("seatMap");
  const [hall, setHall] = useState(null);
  const [totalRow, setTotalRow] = useState(0);
  const [totalCol, setTotalCol] = useState(0);
  const [hallIsUpdating, setHallIsUpdating] = useState(false);
  const [seatIsUpdating, setSeatIsUpdating] = useState(false);
  const [seats2D, setSeats2D] = useState([]);
  const [hallNaming, setHallName] = useState("");

  async function getHallAndSeats(id) {
    try {
      const hallResponse = await axios.get(
        `http://localhost:8080/viewhall/${id}`
      );
      const loadedHall = hallResponse.data;
      const seatResponse = await axios.get(
        `http://localhost:8080/viewseat/hall/${id}`
      );
      const loadedSeats = seatResponse.data;
      let newSeats = [];
      while (loadedSeats.length && loadedHall.totalColumn)
        newSeats.push(loadedSeats.splice(0, loadedHall.totalColumn));
      setHall(loadedHall);
      setTotalCol(loadedHall.totalColumn);
      setTotalRow(loadedHall.totalRow);
      setSeats2D(newSeats);
      setHallName(loadedHall.name);
      console.log(id);
    } catch (error) {
      console.log(error);
    }
  }

  const form = useForm({
    initialValues: {
      name: hallNaming,
    },

    validate: {
      name: (value) => {
        if (value.length === 0) return "Hall name is empty.";
        if (/^\s*$|^\s+.*|.*\s+$/.test(value))
          return "Profile name contains trailing/leading whitespaces";
        return null;
      },
    },
  });

  useEffect(() => {
    getHallAndSeats(id);
  }, []);

  useEffect(() => {
    form.setValues({ name: hallNaming });
  }, [hallNaming]);

  function toggleSuspend(seat) {
    const seatId = seat.id;
    if (seat.blocked) handleUnsuspend(seatId);
    else handleSuspend(seatId);
  }

  function handleSuspend(id) {
    axios
      .delete(`http://localhost:8080/suspendseat/${id}`, {
        blocked: true,
      })
      .then(() => {
        setSeats2D(
          seats2D.map((seats1D) => {
            return seats1D.map((seat) =>
              seat.id === id ? { ...seat, blocked: true } : seat
            );
          })
        );
      })
      .catch((error) => console.log(error));
  }

  function handleUnsuspend(id) {
    axios
      .put(`http://localhost:8080/suspendseat/unsuspend/${id}`, {
        blocked: false,
      })
      .then(() => {
        setSeats2D(
          seats2D.map((seats1D) => {
            return seats1D.map((seat) =>
              seat.id === id ? { ...seat, blocked: false } : seat
            );
          })
        );
      })
      .catch((error) => console.log(error));
  }

  function handleAddSeats() {
    const seatsToSave = [];
    seats2D.forEach((row) => {
      row.forEach((seat) => {
        const { rowId: seatRowId, columnId: seatColumnId, isBlocked } = seat;
        const newSeat = {
          rowId: seatRowId,
          columnId: seatColumnId,
          blocked: isBlocked,
          hallId: id,
        };
        seatsToSave.push(newSeat);
      });
    });

    let newSeats = [];
    const totalSeats = [];
    for (let i = 1; i <= totalRow; i++) {
      for (let j = 1; j <= totalCol; j++) {
        let existingSeat = seatsToSave.find(
          (seat) => seat.rowId === i && seat.columnId === j
        );
        if (!existingSeat) {
          newSeats.push({ rowId: i, columnId: j, blocked: false, hallId: id });
          totalSeats.push({
            rowId: i,
            columnId: j,
            blocked: false,
            hallId: id,
          });
        } else {
          totalSeats.push(existingSeat);
        }
      }
    }
    const updatedHall = {
      id,
      totalRow,
      totalColumn: totalCol,
    };
    axios
      .post(`http://localhost:8080/createseat/addAll`, {
        seats: newSeats,
        hall: updatedHall,
      })
      .then(() => {
        setSeatIsUpdating();
        getHallAndSeats(id);
        notifications.show({
          title: "Seats saved",
          message: "Seat data saved successfully",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        notifications.show({
          title: "Error saving seats",
          autoClose: 3000,
        });
      });
  }

  function handleUpdateSeats() {
    const seatsToSave = [];
    seats2D.forEach((row) => {
      row.forEach((seat) => {
        const { rowId: seatRowId, columnId: seatColumnId, isBlocked } = seat;
        const newSeat = {
          rowId: seatRowId,
          columnId: seatColumnId,
          blocked: isBlocked,
          hallId: id,
        };
        seatsToSave.push(newSeat);
      });
    });

    let newSeats = [];
    const totalSeats = [];
    for (let i = 1; i <= totalRow; i++) {
      for (let j = 1; j <= totalCol; j++) {
        let existingSeat = seatsToSave.find(
          (seat) => seat.rowId === i && seat.columnId === j
        );
        if (!existingSeat) {
          newSeats.push({ rowId: i, columnId: j, blocked: false, hallId: id });
          totalSeats.push({
            rowId: i,
            columnId: j,
            blocked: false,
            hallId: id,
          });
        } else {
          totalSeats.push(existingSeat);
        }
      }
    }
    const updatedHall = {
      id,
      totalRow,
      totalColumn: totalCol,
    };
    axios
      .post(`http://localhost:8080/updateseat/updateAll`, {
        seats: newSeats,
        hall: updatedHall,
      })
      .then(() => {
        setSeatIsUpdating();
        getHallAndSeats(id);
        notifications.show({
          title: "Seats updated",
          message: "Seat data updated successfully",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        notifications.show({
          title: "Error updating seats",
          autoClose: 3000,
        });
      });
  }

  function handleHallUpdate() {
    const updatedHallName = {
      id: id,
      name: form.values.name,
    };
    console.log(updatedHallName);
    axios
      .put(`http://localhost:8080/updatehall/update/${id}`, updatedHallName)
      .then(() => {
        setHallIsUpdating(!hallIsUpdating);
        notifications.show({
          title: "Hall ",
          message: "Hall name updated successfully",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        notifications.show({
          title: "Error updating hall",
          message: error.response.data,
          autoClose: 3000,
        });
      });
  }

  return (
    hall && (
      <div>
        <Container my="md">
          <Grid>
            <Grid.Col xs={6}>
              <TextInput
                type="text"
                className="hallNameField"
                label="Hall Name"
                {...form.getInputProps("name")}
                disabled={!hallIsUpdating}
              />
            </Grid.Col>
            <Grid.Col xs={2}></Grid.Col>
            <Grid.Col xs={8}>
              {hallIsUpdating ? (
                <form onSubmit={form.onSubmit(handleHallUpdate)}>
                  <Button className="submitBtn" type="submit">
                    Submit
                  </Button>
                </form>
              ) : (
                <Button
                  className="updateBtn"
                  onClick={() => setHallIsUpdating(!hallIsUpdating)}
                >
                  Update Hall's Name
                </Button>
              )}
            </Grid.Col>
            <Grid.Col xs={12}></Grid.Col>
            <Grid.Col xs={6}>
              <NumberInput
                defaultValue={0}
                className="rowsField"
                min={hall.totalRow}
                value={totalRow}
                onChange={setTotalRow}
                label="No. of Rows"
                disabled={!seatIsUpdating}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <NumberInput
                defaultValue={0}
                min={hall.totalColumn}
                value={totalCol}
                max={15}
                onChange={setTotalCol}
                label="No. of Columns"
                placeholder=""
                disabled={!seatIsUpdating}
              />
            </Grid.Col>
            <Grid.Col xs={12}>
              {!seats2D.length ? (
                seatIsUpdating ? (
                  <form onSubmit={handleAddSeats}>
                    <Button type="submit" className="submitBtn">
                      Submit
                    </Button>
                  </form>
                ) : (
                  <Button
                    className="updateBtn"
                    onClick={() => setSeatIsUpdating(!seatIsUpdating)}
                  >
                    Create Seats
                  </Button>
                )
              ) : seatIsUpdating ? (
                <form onSubmit={handleUpdateSeats}>
                  <Button type="submit" className="submitBtn">
                    Submit
                  </Button>
                </form>
              ) : (
                <Button
                  className="updateBtn"
                  onClick={() => setSeatIsUpdating(!seatIsUpdating)}
                >
                  Update Seats
                </Button>
              )}
            </Grid.Col>
          </Grid>
        </Container>
        <Container>
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onTabChange={setActiveTab}
          >
            <Tabs.List>
              <Tabs.Tab value="seatMap">Seat Map</Tabs.Tab>
              <Tabs.Tab value="movieSession">Movie Sessions</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="seatMap" pt="xs">
              <SeatMap seats={seats2D} handleClick={toggleSuspend} />
            </Tabs.Panel>
            <Tabs.Panel value="movieSession" pt="xs">
              <ViewMovieSession hallId={id} />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </div>
    )
  );
}

export default ViewHall;
