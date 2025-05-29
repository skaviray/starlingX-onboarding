package stx

type AuthPayload struct {
	Auth Auth `json:"auth"`
}

type Auth struct {
	Identity Identity `json:"identity"`
	Scope    Scope    `json:"scope"`
}

type Identity struct {
	Methods  []string `json:"methods"`
	Password Password `json:"password"`
}

type Password struct {
	User User `json:"user"`
}

type User struct {
	Name     string `json:"name"`
	Password string `json:"password"`
	Domain   Domain `json:"domain"`
}

type Scope struct {
	Project Project `json:"project"`
}

type Project struct {
	Name   string `json:"name"`
	Domain Domain `json:"domain"`
}

type Domain struct {
	Name string `json:"name"`
}

type ISystemsResponse struct {
	Isystems []ISystem `json:"isystems"`
}

type ISystem struct {
	Links []SystemLinks `json:"links"`
}

type SystemLinks struct {
	Href string `json:"href"`
	Rel  string `json:"rel"`
}
