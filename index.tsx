
import React, { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
// import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useAPI";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";

interface Hobby {
  hobby_name: string;
  id: number;
  is_active: number;
}
const StudentHobbies: React.FC = () => {
  const { getData, postData, putData } = useApi();
  const theme = useTheme();
  const [allHobbies, setAllHobbies] = React.useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = React.useState<string[]>([]);
  const [editFalg, setEditFlag] = React.useState<boolean>(false);

  let StudentId = localStorage.getItem("_id");
  console.log(StudentId);

  useEffect(() => {
    getData("hobby/list")
      .then((data: any) => {
        console.log(data);
        if (data?.status === 200) {
          setAllHobbies(data?.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
    getData("student_hobby/edit/" + StudentId)
      .then((data: any) => {
        console.log(data);
        if (data?.status === 200) {
          const hobbyIds = data.data.map(
            (selecthobby: any) => selecthobby.hobby_id
          );
          setSelectedHobbies(hobbyIds);
        } else if (data?.status === 404) {
          setEditFlag(true);
          //   toast.warning("Please Add Your Information", {
          //     hideProgressBar: true,
          //     theme: "colored",
          //   });
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof selectedHobbies>) => {
    setSelectedHobbies(event.target.value as string[]);
  };

  const submithandle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    selectedHobbies.map((hobbyid) => {
      let payload = {
        student_id: StudentId,
        hobby_id: hobbyid,
      };
      console.log(payload);
      if (editFalg) {
        postData("student_hobby/add", payload)
          .then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
              toast.success("hobby saved successfully !!", {
                hideProgressBar: true,
                theme: "colored",
              });
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      } else {
        putData("student_hobby/edit/" + StudentId, payload)
          .then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
              toast.success("hobby saved successfully !!", {
                hideProgressBar: true,
                theme: "colored",
              });
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      }
    });
  };

  return (
    <form onSubmit={submithandle}>
      <div className="row justify-content-center mt-5">
        <div className="col-6 row d-flex justify-content-end">
          <FormControl required sx={{ width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Hobby</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedHobbies}
              onChange={handleChange}
              input={<OutlinedInput label="Hobby" />}
              renderValue={(selected) =>
                (selected as string[])
                  .map((id) => {
                    const hobby = allHobbies.find(
                      (hobby: any) => hobby.id === id
                    );
                    return hobby ? hobby.hobby_name : "";
                  })
                  .join(", ")
              }
            >
              {allHobbies.map((hobby: any) => (
                <MenuItem key={hobby.id} value={hobby.id}>
                  <Checkbox checked={selectedHobbies.indexOf(hobby.id) > -1} />
                  <ListItemText primary={hobby.hobby_name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-6 justify-content-start">
          <button className="btn btn-primary"> save</button>
        </div>
      </div>
    </form>
  );
};

export default StudentHobbies;


// import { QUERY_STUDENT_PROFILE_KEYS } from '../../utils/const';

// const StudentHobbies = () => {
//     const hobbies = [
//         "Reading",
//         "Cooking",
//         "Painting",
//         "Playing musical instruments",
//         "Hiking",
//         "Gardening",
//         "Photography",
//         "Dancing",
//         "Writing",
//         "Fishing",
//         "Camping",
//         "Traveling",
//         "Yoga",
//         "Knitting",
//         "Baking",
//         "Drawing",
//         "Gaming",
//         "Watching movies",
//         "Listening to music",
//         "Birdwatching"
//     ];
//     const theme = useTheme();
//     const [personName, setPersonName] = React.useState<string[]>([]);
//     const ITEM_HEIGHT = 48;
//     const ITEM_PADDING_TOP = 8;
//     const MenuProps = {
//         PaperProps: {
//             style: {
//                 maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//                 width: 250,
//             },
//         },
//     };



//     const getStyles =(name: string, personName: readonly string[], theme: Theme)=>{
//         return {
//             fontWeight:
//                 personName.indexOf(name) === -1
//                     ? theme.typography.fontWeightRegular
//                     : theme.typography.fontWeightMedium,
//         };
//     }


//     const handleChange = (event: SelectChangeEvent<typeof personName>) => {
//         const {
//             target: { value },
//         } = event;
//         setPersonName(
//             // On autofill we get a stringified value.
//             typeof value === 'string' ? value.split(',') : value,
//         );
//     };

//     return (
//         <div className='row justify-content-center'>
//             <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
//                 <Select
//                     multiple
//                     displayEmpty
//                     value={personName}
//                     onChange={handleChange}
//                     input={<OutlinedInput />}
//                     renderValue={(selected) => {
//                         if (selected.length === 0) {
//                             return <em>Select Hobbies</em>;
//                         }

//                         return selected.join(', ');
//                     }}
//                     MenuProps={MenuProps}
//                     inputProps={{ 'aria-label': 'Without label' }}
//                 >
//                     <MenuItem disabled value="">


//                     </MenuItem>
//                     {hobbies.map((name) => (
//                         <MenuItem
//                             key={name}
//                             value={name}
//                             style={getStyles(name, personName, theme)}
//                         >
//                             {name}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//         </div>
//     );
