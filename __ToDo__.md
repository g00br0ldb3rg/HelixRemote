
  - implement logging library
    - implement @ machine utilities
    - implement @ package/workspace scripts 
      - "default":          warn ?
      - `{script}-verbose`: verbose

  - implement:
    - remaining MIDI functions from spreadsheet
    - footswitch UI
      - Edit:       Numbering @ Stomps
      - Looper:     Looper UI
      - Presets:    Numbering @ Presets,   Arrows   @ [1,7]
      - Snapshots:  Numbering @ Snapshots, Disabled @ [1,7]
      - Stomps:     Numbering @ Stomps
    - MIDI log from Helix @ console
    - reset `ModeTransitions` machine to `Snapshots` state when [Setlist, Preset] changed
      - from [UI, Helix]
      - prevent transition/entry/etc actions
      - add manual reset button @ UI
    - indicator for current [Setlist, Snapshot]
      - possible to initialize on Helix connection ?
        - try
          - [App  .start, Helix.start]
          - [Helix.start, App  .start]

  - new features:
    - Piano UI for Synth
    - parameter automation [duration, easing]

  - multiple UI modes
    - FullScreen-Performance
    - FullScreen-SoundDesign
    - FullScreen-Develop: all controls
    - SplitScreen-HXEdit

  - `LooperControls` machine
    - update footswitch UI
    - reset @ [Setlist, Preset] change


//####################################################################################################################//
//##>  Future                                                                                                       ##//
//####################################################################################################################//

  - generated UI for navigating setlists & presets, with actual names
