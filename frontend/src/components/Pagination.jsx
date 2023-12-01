import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const PaginationComponent = ({
  categoryName,
  searchParams,
  totalPages,
  setAllFilters,
}) => {
  const category = categoryName ? `category/${categoryName}/` : "";
  const search = searchParams?.searchQuery
    ? `search/${searchParams?.searchQuery}/`
    : "";
  const url = `/product-list/${category}${search}`;

  return (
    <Pagination>
      <LinkContainer to={`${url}${searchParams?.page - 1}`}>
        <Pagination.Prev
          disabled={searchParams?.page === 1}
          onClick={() => setAllFilters({ ...searchParams, page: 1 })}
        />
      </LinkContainer>
      {[...Array(totalPages).keys()].map((num) => (
        <LinkContainer key={num + 1} to={`${url}${num + 1}`}>
          <Pagination.Item
            active={num + 1 === searchParams?.page}
            onClick={() => setAllFilters({ ...searchParams, page: num + 1 })}
          >
            {num + 1}
          </Pagination.Item>
        </LinkContainer>
      ))}
      <LinkContainer to={`${url}${searchParams?.page + 1}`}>
        <Pagination.Next
          disabled={searchParams?.page === totalPages}
          onClick={() => setAllFilters({ ...searchParams, page: totalPages })}
        />
      </LinkContainer>
    </Pagination>
  );
};

export default PaginationComponent;
