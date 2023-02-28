Bug @ Stately:
  - seems related to `raise` ?
  - with `raise`
  ```log
  [Snapshots] > Stomps > Presets > Stomps


  index.tsx:75 {from: 'Snapshots', to: 'Stomps'}
  index.ts:133 {--: 'from Snapshots to Stomps', _history: '["Snapshots","Stomps"]'}
  index.ts:144 @@@ Stomps @@@ TO_STOMPS (2) ['Snapshots', 'Stomps']
  Helix.ts:55 {"current":[["Mode_Stomps"]],"remaining":[]}


  index.tsx:73 {from: 'Stomps', to: 'Presets'}
  index.ts:146 {--: 'from Stomps to Snapshots', _history: '["Snapshots"]'}
  index.ts:129 @@@ Snapshots @@@ _EXIT ['Snapshots']
  Helix.ts:55 {"current":[["Mode_Default"]],"remaining":[]}
  ---------------------------------------------------------
  index.ts:132 {--: 'from Snapshots to Presets', _history: '["Snapshots","Presets"]'}
  index.ts:117 @@@ Presets @@@ TO_PRESETS (2) ['Snapshots', 'Presets']
  Helix.ts:55 {"current":[["FS1"]],"remaining":[]}


  index.tsx:75 {from: 'Presets', to: 'Stomps'}
  index.ts:119 {--: 'from Presets to Snapshots', _history: '["Snapshots"]'}
  index.ts:129 @@@ Snapshots @@@ _EXIT ['Snapshots']
  Helix.ts:55 {"current":[["Mode_Toggle"]],"remaining":[]}
  --------------------------------------------------------
  index.ts:119 {--: 'from Presets to Snapshots', _history: '["Snapshots","Stomps"]'}      <---- [actual] firing `entry` from inactive state
  Helix.ts:55 {"current":[["Mode_Stomps"]],"remaining":[[["Mode_Toggle"]]]}
  Helix.ts:55 {"current":[["Mode_Toggle"]],"remaining":[]}
  ```
  
  - with `send`
  ```log
  index.tsx:75 {from: 'Snapshots', to: 'Stomps'}
  index.ts:133 {--: 'from Snapshots to Stomps', _history: '["Snapshots","Stomps"]'}
  index.ts:144 @@@ Stomps @@@ TO_STOMPS (2) ['Snapshots', 'Stomps']
  Helix.ts:55 {"current":[["Mode_Stomps"]],"remaining":[]}


  index.tsx:73 {from: 'Stomps', to: 'Presets'}
  index.ts:146 {--: 'from Stomps to Snapshots', _history: '["Snapshots"]'}
  index.ts:129 @@@ Snapshots @@@ _EXIT ['Snapshots']
  Helix.ts:55 {"current":[["Mode_Default"]],"remaining":[]}
  ---------------------------------------------------------
  index.ts:132 {--: 'from Snapshots to Presets', _history: '["Snapshots","Presets"]'}
  index.ts:117 @@@ Presets @@@ TO_PRESETS (2) ['Snapshots', 'Presets']
  Helix.ts:55 {"current":[["FS1"]],"remaining":[]}


  index.tsx:75 {from: 'Presets', to: 'Stomps'}
  index.ts:119 {--: 'from Presets to Snapshots', _history: '["Snapshots"]'}
  index.ts:129 @@@ Snapshots @@@ _EXIT ['Snapshots']
  Helix.ts:55 {"current":[["Mode_Toggle"]],"remaining":[]}
  --------------------------------------------------------
  index.ts:133 {--: 'from Snapshots to Stomps', _history: '["Snapshots","Stomps"]'}      <---- [expected] firing `entry` from active state
  index.ts:144 @@@ Stomps @@@ TO_STOMPS (2) ['Snapshots', 'Stomps']
  Helix.ts:55 {"current":[["Mode_Stomps"]],"remaining":[]}
  ```
