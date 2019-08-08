import * as bip39 from "bip39";
import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

interface MnemonicInputProps {
  readonly id: string;
  readonly onWordsChanged?: (words: readonly string[]) => void;
}

interface MnemonicInputState {
  readonly words: readonly string[];
}

class MnemonicInput extends React.Component<MnemonicInputProps, MnemonicInputState> {
  public constructor(props: MnemonicInputProps) {
    super(props);
    this.state = {
      words: [],
    };
  }

  public render(): JSX.Element {
    return (
      <div>
        <Typeahead
          id={this.props.id}
          multiple={true}
          bsSize="lg"
          onChange={selected => {
            console.log(selected);
            this.setState({ words: selected });
            this.props.onWordsChanged && this.props.onWordsChanged(selected);
          }}
          selectHintOnEnter={true}
          options={bip39.wordlists.english}
          filterBy={(option, props) => {
            const normalized = props.text.trim().toLowerCase();
            return option.startsWith(normalized);
          }}
        />
      </div>
    );
  }
}

export default MnemonicInput;
