import React, { FC, useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { mapControlsToValues } from './utils';
import { login as sessionLogin } from './session';

export const Login: FC = () => {
	const [errorMessage, setErrorMessage] = useState('');

	return (
		<LoginMutation
			mutation={gql`
				mutation signinUser($email: String!, $password: String!) {
					signinUser(email: { email: $email, password: $password }) {
						token
					}
				}
			`}
		>
			{login => (
				<form
					onSubmit={event => {
						event.persist();
						event.preventDefault();
						const { email, password } = mapControlsToValues(
							// @ts-ignore
							event.target.elements
						);
						login({
							variables: { email, password },
						}).then(
							response =>
								// @ts-ignore
								sessionLogin(response.data.signinUser.token),
							() => setErrorMessage(`Sorry! We couldn't log you in 😢`)
						);
					}}
				>
					<h2>Login</h2>
					<label>
						<div>Email</div>
						<input type="email" name="email" autoFocus />
					</label>
					<label>
						<div>Password</div>
						<input type="password" name="password" autoComplete="off" />
					</label>
					<br />
					<button type="submit">Login</button>

					{Boolean(errorMessage) && <p>{errorMessage}</p>}
				</form>
			)}
		</LoginMutation>
	);
};

type LoginData = {
	signinUser: {
		token: string;
	};
};

class LoginMutation extends Mutation<LoginData> {}
