
  - implement:

    - reset `ModeTransitions` machine to `Snapshots` state when:
      - [Setlist, Preset] changed
      - `Reset` action executed

    - MIDI
      - helix connection status indicator @ UI
        - change error to warning
        - attempt connection on new MIDI devices

    - footswitch UI
      - Edit:       Numbering @ Stomps
      - Looper:     Looper UI
      - Presets:    Numbering @ Presets,   Arrows   @ [1,7]
      - Snapshots:  Numbering @ Snapshots, Disabled @ [1,7]
      - Stomps:     Numbering @ Stomps

    - MIDI log from Helix @ console
      - from [UI, Helix]
      - prevent transition/entry/etc actions
      - add manual reset button @ UI

    - indicator for current [Setlist, Snapshot]
      - possible to initialize on Helix connection ?
        - try
          - [App  .start, Helix.start]
          - [Helix.start, App  .start]

    - add state machines for MIDI spec
      - NOTE
        - consider reducing API before implementing everything
          - delegate to HX Edit
      - Mode.Looper
        - Active
          - looper controls
            - {direction, speed, etc}
        - Inactive
      - Mode.Edit
        - Navigate_ParameterPage_Previous
      - ???

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
    - UI for automated duration

  - README:
    - Requirements:
      - Line 6 Helix Floor connected to computer via USB
        - update this if you end up implementing a Client/Server method to do this wirelessly
        - Client/Server probably not worth doing... HX Edit needs to be wired and solo-HelixRemote isn't as useful as HX Edit + HelixRemote
      - setting for 8-Snapshots
        - edit this line to provide more detail


//####################################################################################################################//
//##>  Future                                                                                                       ##//
//####################################################################################################################//

  - generated UI for navigating setlists & presets, with actual names
