import { useEffect, useState, useRef } from "react";
import { TextInput, Button, Select, Text } from "@mantine/core";
import { DateTimePicker, DatePickerInput, TimeInput } from "@mantine/dates";
import axios from "axios";
import { IconClock } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";

//DATE, MOVIENAME,STARTTIME,ENDTIME

function MSForm({ hallId = null }) {
  const bufferTimeInMinutes = 60;
  const startTimeRef = useRef(new Date().getTime());
  const [date, setDate] = useState(new Date());
  const [hall, setHall] = useState({ id: hallId });
  const [movie, setMovie] = useState({});
  const [hallOptions, setHallOptions] = useState([{ value: "", label: "" }]);
  const [movieOptions, setMovieOptions] = useState([{ value: "", label: "" }]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [suspendedMovies, setSuspendedMovies] = useState([]);

  useEffect(() => {
    async function getFieldData() {
      try {
        const movieResponse = await axios.get(
          "http://localhost:8080/viewmovie/all"
        );
        if (movieResponse.data && movieResponse.data.length > 0) {
          setMovieOptions(
            movieResponse.data.map((movie) => ({
              value: movie,
              label: movie.title,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    getFieldData();
  }, []);

  useEffect(() => {
    const et = new Date(
      `${date.getFullYear()} ${date.getMonth() + 1
      } ${date.getDate()} ${startTime}`
    );

    if (movie?.runTime) {
      et.setMinutes(et.getMinutes() + movie?.runTime + bufferTimeInMinutes);
    }

    if (et)
      setEndTime(
        et.toLocaleTimeString("en-SG", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
  }, [movie, date, startTime]);

  useEffect(() => {
    async function getMovieData() {
      try {
        const movieResponse = await axios.get(
          "http://localhost:8080/viewmovie/all"
        );
        if (movieResponse.data && movieResponse.data.length > 0) {
          setMovieOptions(
            movieResponse.data.map((movie) => ({
              value: movie,
              label: movie.title,
            }))
          );
          setSuspendedMovies(
            movieResponse.data.filter((movie) => movie.suspended)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    getMovieData();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (!startTime) {
      notifications.show({
        title: "Error creating Movie Session",
        message: "Please fill in the start time field.",
        autoClose: 3000,
      });
      return;
    }

    if (movie.suspended) {
      notifications.show({
        title: "Error creating Movie Session",
        message:
          "This movie is currently not available and cannot be selected.",
        autoClose: 3000,
      });
      return;
    }

    axios
      .post("http://localhost:8080/createmoviesession/add", {
        movieId: movie.id,
        hallId: hall.id,
        startDateTime: new Date(
          `${date.getFullYear()} ${date.getMonth() + 1
          } ${date.getDate()} ${startTime}`
        ),
        endDateTime: new Date(
          `${date.getFullYear()} ${date.getMonth() + 1
          } ${date.getDate()} ${endTime}`
        ),
      })
      .then(() => {
        notifications.show({
          title: `Movie Session`,
          message: "Movie Session created successfully",
          autoClose: 3000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        notifications.show({
          title: "Error creating Movie Session",
          message: error.response.data,
          autoClose: 100000,
        });
      });
  }

  return (
    <form className="CMCreateMS">
      <div>
        <DatePickerInput
          className="DateField"
          mt="md"
          popoverProps={{ withinPortal: true }}
          placeholder="When is it avaliable?"
          label="Movie Session Date"
          clearable={false}
          minDate={new Date()}
          value={date}
          onChange={(event) => {
            console.log(event);
            setDate(event);
          }}
        />

        <Select
          className="movieNameField"
          label="Movie"
          data={movieOptions}
          value={movie}
          onChange={setMovie}
          withAsterisk
        />

        <TimeInput
          className="startTimeField"
          placeholder="What time does it start"
          rightSection={
            <ActionIcon onClick={() => startTimeRef.current.showPicker()}>
              <IconClock size="1rem" stroke={1.5} />
            </ActionIcon>
          }
          label="Start Time"
          minDate={new Date()}
          value={startTime}
          ref={startTimeRef}
          onChange={(event) => setStartTime(event.target.value)}
        />
        <TimeInput
          className="endTimeField"
          placeholder="What time does it end"
          label="Calculated End Time"
          value={endTime}
          disabled
        />
      </div>
      <Button className="msBtn" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </form>
  );
}

export default MSForm;
