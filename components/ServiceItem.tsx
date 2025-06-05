
import React from 'react';
import { Service } from '../types';
import { formatCurrency } from '../utils';

interface ServiceItemProps {
  service: Service;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
  return (
    <li className="flex items-center justify-between py-3 px-1 border-b border-slate-200 last:border-b-0">
      <div className="flex items-center space-x-3">
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100">
         {service.icon}
        </span>
        <div>
          <p className="text-sm font-medium text-slate-800">{service.name}</p>
          <p className="text-xs text-slate-500">{service.description}</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-slate-700">
        {formatCurrency(service.originalPrice)}
      </span>
    </li>
  );
};

export default ServiceItem;