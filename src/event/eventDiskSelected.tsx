import mitt from 'mitt';

type Events = {
  clearDiv: void; // Event name with payload type (use `void` for no payload)
};

const eventDiskSelected = mitt<Events>();

export default eventDiskSelected;