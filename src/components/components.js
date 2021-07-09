const SearchBar = ({onChange, placeholder, onClick, onKeyDown}) => {
    return (
      <div className="Search">
        <span className="SearchSpan">
        </span>
        <input
          size={60}
          className="SearchInput"
          type="text"
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
        />
        <button onClick={onClick} type="submit" style={{marginLeft:10}}>search</button>
      </div>
    );
  };

const SampleText = () => {
    return (
        <p> lorem ipsum</p>
    )
}

const components = {SearchBar, SampleText}
export default components;

//<button onClick={onClick} type="submit"><i class="fa fa-search"></i></button>