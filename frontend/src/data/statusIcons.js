
import { FaCheck, FaClock, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
export  const statusIconMap = {
  pending: {
    icon: FaHourglassHalf  ,
    bg: 'bg-yellow-100'
  },
  confirmed: {
    icon: FaCheck,
    bg: 'bg-blue-100'
  },
  completed: {
    icon: FaCheck,
    bg: 'bg-green-100'
  },
  cancelled: {
    icon: FaTimesCircle ,
    bg: 'bg-red-100'
  },
};
