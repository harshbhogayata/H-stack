import { TruckIcon } from './icons';
import './ShipmentRow.css';

const STATUS_LABEL = { booked: 'Booked', in_transit: 'In transit', delayed: 'Delayed', delivered: 'Delivered' };

export function ShipmentRow({ shipment }) {
  return (
    <tr className="hb-shipment-row">
      <td>{shipment.container}</td>
      <td>{shipment.origin} → {shipment.destination}</td>
      <td>
        <span className={`hb-status hb-status--${shipment.status}`}>
          <TruckIcon /> {STATUS_LABEL[shipment.status]}
        </span>
      </td>
      <td className="hb-num">{shipment.eta}</td>
    </tr>
  );
}
