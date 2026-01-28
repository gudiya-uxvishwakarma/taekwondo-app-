/**
 * Icon Component
 * Unified icon component using react-native-vector-icons
 */

import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Icon = ({ 
  name, 
  size = 24, 
  color = '#000', 
  type = 'MaterialIcons',
  style,
  testID 
}) => {
  const IconComponent = {
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome,
  }[type];

  if (!IconComponent) {
    console.warn(`Icon type "${type}" not found. Using MaterialIcons as fallback.`);
    return <MaterialIcons name={name} size={size} color={color} style={style} testID={testID} />;
  }

  return <IconComponent name={name} size={size} color={color} style={style} testID={testID} />;
};

export default Icon;