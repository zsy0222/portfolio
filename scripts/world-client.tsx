import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import DigitalWorld from '../src/components/DigitalWorld';
const props=JSON.parse(document.getElementById('world-props')!.textContent!);
hydrateRoot(document.getElementById('world-root')!,<DigitalWorld {...props}/>);
