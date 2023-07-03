import { IconButton, List, ListItem, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
type RequirementDisplayProps = {
  requirements: string[];
  onRemove: (index: number) => void;
};

export const RequirementDisplay = ({ requirements, onRemove }: RequirementDisplayProps) => {
  return (
    <List>
      {requirements.map((requirement, index) => {
        return (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton>
                <DeleteIcon onClick={() => onRemove(index)} />
              </IconButton>
            }
          >
            <Typography variant={'body1'}>{requirement}</Typography>
          </ListItem>
        );
      })}
    </List>
  );
};
