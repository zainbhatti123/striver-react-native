import React from 'react';
import {Provider as PaperUIProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as StoreProvide} from 'react-redux';
import {SheetProvider} from 'react-native-actions-sheet';
import './sheets/FilterSheet';
import './sheets/SeeMoreSheet';
import './sheets/CommentSheet';
import './sheets/MoreSheet';

// local imports
import ScreenNavigation from './navigation/ScreenNavigation';
import {store} from './store';

const App = () => {
  return (
    <StoreProvide store={store}>
      <SheetProvider>
        <PaperUIProvider>
          <SafeAreaProvider>
            <ScreenNavigation />
          </SafeAreaProvider>
        </PaperUIProvider>
      </SheetProvider>
    </StoreProvide>
  );
};

export default App;
