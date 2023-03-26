const Movie = (props) => {
  const { Title, Year, imdbID, Type, Poster } = props.movie; //? Taking in the props from the parent component and destructuring them

  return (
    <div className="row">
      <div className="col-4 col-md-3 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <img src={Poster} className="img-fluid" />
        </a>
      </div>
      <div className="col-8 col-md-9 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <h4>{Title}</h4>
          <p>
            {Type} | {Year}
          </p>
        </a>
      </div>
    </div>
  );
};

class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      results: [],
      error: "",
    };

    //? .bind() is used to bind the context of 'this' to the current class
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value }); //! Updating the state onChange of input
  }

  handleSubmit(event) {
    event.preventDefault(); //! Prevents the page from reloading unnecessarily on submit
    let { searchTerm } = this.state; //? ES6 destructuring
    searchTerm = searchTerm.trim(); //? .trim() removes whitespace from both ends of a string

    if (!searchTerm) {
      return;
    }

    //? checkStatus and json are helper functions. They are used to check the status of the response and convert the response to json.
    //? In larger code bases such functions are better placed in a separate file and imported.
    const checkStatus = (response) => {
      if (response.ok) {
        return response;
      }
      throw new Error("Request was either a 404 or 500");
    };
    const json = (response) => response.json();

    //? Fetching data from the API
    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=b7da8d63`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        if (data.Response === "True" && data.Search) {
          this.setState({ results: data.Search, error: "" });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  render() {
    const { searchTerm, results, error } = this.state; //! ES6 destructuring

    return (
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
                type="text"
                className="form-control mr-sm-2"
                placeholder="frozen"
                value={searchTerm}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>

            {/* //? if theres an error display it, otherwise map MovieCards */}
            {(() => {
              if (error) {
                return error;
              }
              return results.map((movie) => {
                return <Movie key={movie.imdbID} movie={movie} />;
              });
            })()}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MovieFinder />, document.getElementById("root"));
