import { EnglishMnemonic } from "@iov/crypto";
import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

const wordlist = [...EnglishMnemonic.wordlist]; // create copy of correct type

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
          options={wordlist}
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
